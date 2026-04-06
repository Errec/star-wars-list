export interface SwapiListResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface SwapiPerson {
  name: string
  height: string
  mass: string
  birth_year: string
  gender: string
  homeworld: string
  url: string
}

export interface SwapiPlanet {
  name: string
  terrain: string
  population: string
  diameter: string
  residents: string[]
  url: string
}

const extractIdFromUrl = (url: string): number | null => {
  const matched = url.match(/\/(\d+)\/?$/)
  return matched ? Number.parseInt(matched[1], 10) : null
}

export const normalizeSwapiUrl = (value: string): string => value.replace('http://', 'https://')

export const withRetry = async <T>(request: () => Promise<T>, attempts = 3): Promise<T> => {
  let currentAttempt = 0
  let delayMs = 150

  while (currentAttempt < attempts) {
    try {
      return await request()
    } catch (error) {
      currentAttempt += 1
      if (currentAttempt >= attempts) {
        throw error
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs))
      delayMs *= 2
    }
  }

  throw new Error('Retry loop ended unexpectedly.')
}

export const parseIdFromSwapiUrl = extractIdFromUrl
