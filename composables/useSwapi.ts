import type { PeopleApiResponse, Person, PlanetDetails } from '~/types/swapi'

export type SortField = 'id' | 'name' | 'planetName'

const defaultPlanetDetails = (planetName: string): PlanetDetails => ({
  id: 0,
  name: planetName,
  terrain: 'unknown',
  population: 'unknown',
  diameter: 'unknown',
  residentsNames: []
})

export const useSwapi = () => {
  const search = ref('')
  const debouncedSearch = ref('')
  const page = ref(1)
  const sortBy = ref<SortField>('id')

  let debounceHandle: ReturnType<typeof setTimeout> | null = null

  watch(search, (value) => {
    page.value = 1

    if (debounceHandle) {
      clearTimeout(debounceHandle)
    }

    debounceHandle = setTimeout(() => {
      debouncedSearch.value = value
    }, 250)
  })

  const requestQuery = computed(() => ({
    search: debouncedSearch.value,
    page: page.value
  }))

  const { data, pending, error, refresh } = useFetch<PeopleApiResponse>('/api/sw/people', {
    query: requestQuery,
    default: () => ({ total: 0, nextPage: null, previousPage: null, results: [] }),
    watch: [requestQuery]
  })

  const sortedPeople = computed<Person[]>(() => {
    return [...data.value.results].sort((a, b) => {
      const first = a[sortBy.value]
      const second = b[sortBy.value]

      if (typeof first === 'number' && typeof second === 'number') {
        return first - second
      }

      return String(first).localeCompare(String(second))
    })
  })

  const total = computed(() => data.value.total)
  const hasNextPage = computed(() => data.value.nextPage !== null)
  const hasPreviousPage = computed(() => data.value.previousPage !== null)

  const nextPage = () => {
    if (data.value.nextPage) {
      page.value = data.value.nextPage
    }
  }

  const previousPage = () => {
    if (data.value.previousPage) {
      page.value = data.value.previousPage
    }
  }

  const loadPlanet = async (planetId: number | null, fallbackPlanetName: string): Promise<PlanetDetails> => {
    if (!planetId) {
      return defaultPlanetDetails(fallbackPlanetName)
    }

    try {
      return await $fetch<PlanetDetails>(`/api/sw/planet/${planetId}`)
    } catch {
      return defaultPlanetDetails(fallbackPlanetName)
    }
  }

  return {
    search,
    page,
    sortBy,
    pending,
    error,
    total,
    sortedPeople,
    hasNextPage,
    hasPreviousPage,
    refresh,
    nextPage,
    previousPage,
    loadPlanet
  }
}
