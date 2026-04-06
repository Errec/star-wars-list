import { createError } from 'h3'

interface CircuitState {
  failures: number
  openedAt: number | null
}

const BREAKER_THRESHOLD = 5
const BREAKER_COOLDOWN_MS = 30_000

const circuitState: CircuitState = {
  failures: 0,
  openedAt: null
}

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

const isCircuitOpen = (): boolean => {
  if (circuitState.openedAt === null) {
    return false
  }

  const elapsed = Date.now() - circuitState.openedAt
  if (elapsed > BREAKER_COOLDOWN_MS) {
    circuitState.openedAt = null
    circuitState.failures = 0
    return false
  }

  return true
}

const markSuccess = () => {
  circuitState.failures = 0
  circuitState.openedAt = null
}

const markFailure = () => {
  circuitState.failures += 1

  if (circuitState.failures >= BREAKER_THRESHOLD) {
    circuitState.openedAt = Date.now()
  }
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

export const swapiRequest = async <T>(url: string): Promise<T> => {
  if (isCircuitOpen()) {
    throw createError({ statusCode: 503, statusMessage: 'SWAPI is temporarily unavailable. Please retry shortly.' })
  }

  try {
    const response = await withRetry(() =>
      $fetch<T>(normalizeSwapiUrl(url), {
        headers: { accept: 'application/json' },
        timeout: 5000
      })
    )

    markSuccess()
    return response
  } catch (error) {
    markFailure()
    throw error
  }
}

export const parseIdFromSwapiUrl = extractIdFromUrl
