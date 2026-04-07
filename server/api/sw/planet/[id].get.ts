import { createError, getRouterParam } from 'h3'
import type { PlanetDetails } from '~/types/swapi'
import { parseIdFromSwapiUrl, swapiRequest, type SwapiPlanet, type SwapiPerson } from '~/server/utils/swapi'

export default defineEventHandler(async (event): Promise<PlanetDetails> => {
  const idParam = getRouterParam(event, 'id')
  const id = idParam ? Number.parseInt(idParam, 10) : NaN

  if (!Number.isInteger(id) || id < 1) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid planet id.' })
  }

  try {
    const config = useRuntimeConfig(event)
    const planet = await swapiRequest<SwapiPlanet>(`${config.swapiBaseUrl}/planets/${id}/`)

    const residentsNames = await Promise.all(
      planet.residents.map(async (residentUrl) => {
        try {
          const resident = await swapiRequest<SwapiPerson>(residentUrl)
          return resident.name
        } catch (error) {
          console.warn(`Failed to fetch resident ${residentUrl}.`, error)
          return null
        }
      })
    )

    return {
      id: parseIdFromSwapiUrl(planet.url) ?? id,
      name: planet.name,
      terrain: planet.terrain,
      population: planet.population,
      diameter: planet.diameter,
      residentsNames: residentsNames.filter((name): name is string => Boolean(name))
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    console.error(`Failed to fetch planet ${id}.`, error)
    throw createError({
      statusCode: 502,
      statusMessage: 'Unable to fetch this planet right now. Please try again.'
    })
  }
})
