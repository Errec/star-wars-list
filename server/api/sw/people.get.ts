import type { H3Event } from 'h3'
import { createError, getQuery } from 'h3'
import type { PeopleApiResponse, Person } from '~/types/swapi'
import { normalizeSwapiUrl, parseIdFromSwapiUrl, withRetry, type SwapiListResponse, type SwapiPerson } from '~/server/utils/swapi'

const toPageNumber = (url: string | null): number | null => {
  if (!url) {
    return null
  }

  const parsed = new URL(normalizeSwapiUrl(url))
  const page = parsed.searchParams.get('page')
  return page ? Number.parseInt(page, 10) : null
}

const fetchPeopleList = async (event: H3Event, searchTerm: string, page: number) => {
  const config = useRuntimeConfig(event)
  const searchParams = new URLSearchParams({ page: String(page) })

  if (searchTerm.trim()) {
    searchParams.set('search', searchTerm.trim())
  }

  return withRetry(() =>
    $fetch<SwapiListResponse<SwapiPerson>>(`${config.swapiBaseUrl}/people/?${searchParams.toString()}`, {
      headers: { accept: 'application/json' }
    })
  )
}

const fetchPlanetNames = async (event: H3Event, planetUrls: string[]): Promise<Map<string, string>> => {
  if (!planetUrls.length) {
    return new Map()
  }

  const entries = await Promise.all(
    planetUrls.map(async (planetUrl) => {
      const planet = await withRetry(() =>
        $fetch<{ name: string }>(normalizeSwapiUrl(planetUrl), {
          headers: { accept: 'application/json' }
        })
      )

      return [planetUrl, planet.name] as const
    })
  )

  return new Map(entries)
}

export default defineEventHandler(async (event): Promise<PeopleApiResponse> => {
  const query = getQuery(event)
  const pageParam = Array.isArray(query.page) ? query.page[0] : query.page
  const searchParam = Array.isArray(query.search) ? query.search[0] : query.search

  const page = pageParam ? Number.parseInt(pageParam, 10) : 1
  const search = typeof searchParam === 'string' ? searchParam : ''

  if (!Number.isInteger(page) || page < 1) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid page parameter.' })
  }

  try {
    const data = await fetchPeopleList(event, search, page)
    const uniquePlanetUrls = [...new Set(data.results.map((person) => person.homeworld).filter(Boolean))]
    const planetNameMap = await fetchPlanetNames(event, uniquePlanetUrls)

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
