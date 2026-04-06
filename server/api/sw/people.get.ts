import { createError, getQuery } from 'h3'
import type { PeopleApiResponse, Person } from '~/types/swapi'
import { parseIdFromSwapiUrl, swapiRequest, type SwapiListResponse, type SwapiPerson } from '~/server/utils/swapi'

const toPageNumber = (url: string | null): number | null => {
  if (!url) {
    return null
  }

  const parsed = new URL(url.replace('http://', 'https://'))
  const page = parsed.searchParams.get('page')
  return page ? Number.parseInt(page, 10) : null
}

const normalizeSearchTerm = (term: string): string => term.trim().slice(0, 64)

export default defineEventHandler(async (event): Promise<PeopleApiResponse> => {
  const config = useRuntimeConfig(event)
  const query = getQuery(event)
  const pageParam = Array.isArray(query.page) ? query.page[0] : query.page
  const searchParam = Array.isArray(query.search) ? query.search[0] : query.search

  const page = pageParam ? Number.parseInt(pageParam, 10) : 1
  const search = typeof searchParam === 'string' ? normalizeSearchTerm(searchParam) : ''

  if (!Number.isInteger(page) || page < 1) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid page parameter.' })
  }

  try {
    const searchParams = new URLSearchParams({ page: String(page) })

    if (search) {
      searchParams.set('search', search)
    }

    const data = await swapiRequest<SwapiListResponse<SwapiPerson>>(
      `${config.swapiBaseUrl}/people/?${searchParams.toString()}`
    )

    const uniquePlanetUrls = [...new Set(data.results.map((person) => person.homeworld).filter(Boolean))]

    const planetNameEntries = await Promise.all(
      uniquePlanetUrls.map(async (planetUrl) => {
        const planet = await swapiRequest<{ name: string }>(planetUrl)
        return [planetUrl, planet.name] as const
      })
    )

    const planetNameMap = new Map(planetNameEntries)

    const normalizedResults: Person[] = data.results.map((person) => ({
      id: parseIdFromSwapiUrl(person.url) ?? 0,
      name: person.name,
      height: person.height,
      mass: person.mass,
      birthYear: person.birth_year,
      gender: person.gender,
      planetId: parseIdFromSwapiUrl(person.homeworld),
      planetName: planetNameMap.get(person.homeworld) ?? 'Unknown'
    }))

    return {
      total: data.count,
      nextPage: toPageNumber(data.next),
      previousPage: toPageNumber(data.previous),
      results: normalizedResults
    }
  } catch (error) {
    console.error('Failed to fetch people from SWAPI.', error)
    throw createError({
      statusCode: 502,
      statusMessage: 'Unable to fetch Star Wars people right now. Please try again.'
    })
  }
})
