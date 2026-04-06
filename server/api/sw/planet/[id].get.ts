import { createError, getRouterParam } from 'h3'
import type { PlanetDetails } from '~/types/swapi'
import { normalizeSwapiUrl, parseIdFromSwapiUrl, withRetry, type SwapiPlanet, type SwapiPerson } from '~/server/utils/swapi'

export default defineEventHandler(async (event): Promise<PlanetDetails> => {
  const idParam = getRouterParam(event, 'id')
  const id = idParam ? Number.parseInt(idParam, 10) : NaN

  if (!Number.isInteger(id) || id < 1) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid planet id.' })
  }

  try {
    const config = useRuntimeConfig(event)
    const planet = await withRetry(() =>
      $fetch<SwapiPlanet>(`${config.swapiBaseUrl}/planets/${id}/`, { headers: { accept: 'application/json' } })
    )

    const residentsNames = await Promise.all(
      planet.residents.map(async (residentUrl) => {
        const resident = await withRetry(() =>
          $fetch<SwapiPerson>(normalizeSwapiUrl(residentUrl), {
            headers: { accept: 'application/json' }
          })
        )
        return resident.name
      })
    )

    return {
      id: parseIdFromSwapiUrl(planet.url) ?? id,
      name: planet.name,
      terrain: planet.terrain,
      population: planet.population,
      diameter: planet.diameter,
      residentsNames
    }
  } catch (error) {
    console.error(`Failed to fetch planet ${id}.`, error)
    throw createError({
      statusCode: 502,
      statusMessage: 'Unable to fetch this planet right now. Please try again.'
    })
  }
})
