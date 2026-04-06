<script setup lang="ts">
import AppHeader from '~/components/layout/AppHeader.vue'
import EntityModal from '~/components/layout/EntityModal.vue'
import PeopleGrid from '~/components/layout/PeopleGrid.vue'
import type { Person, PlanetDetails } from '~/types/swapi'

useHead({
  title: 'Star Wars List',
  meta: [{ name: 'description', content: 'Search Star Wars characters and planets from SWAPI.' }]
})

const {
  search,
  sortBy,
  pending,
  error,
  total,
  sortedPeople,
  hasNextPage,
  hasPreviousPage,
  resetPage,
  nextPage,
  previousPage,
  refresh,
  loadPlanet
} = useSwapi()

const selectedPerson = ref<Person | null>(null)
const selectedPlanet = ref<PlanetDetails | null>(null)
const modalMode = ref<'person' | 'planet' | null>(null)
const planetLoading = ref(false)

watch(search, () => {
  resetPage()
})

const openPersonModal = (person: Person) => {
  selectedPerson.value = person
  selectedPlanet.value = null
  modalMode.value = 'person'
}

const openPlanetModal = async (person: Person) => {
  selectedPerson.value = person
  modalMode.value = 'planet'
  planetLoading.value = true
  selectedPlanet.value = await loadPlanet(person.planetId, person.planetName)
  planetLoading.value = false
}

const openPlanetFromPersonModal = async () => {
  if (!selectedPerson.value) {
    return
  }

  modalMode.value = 'planet'
  planetLoading.value = true
  selectedPlanet.value = await loadPlanet(selectedPerson.value.planetId, selectedPerson.value.planetName)
  planetLoading.value = false
}

const closeModal = () => {
  modalMode.value = null
}
</script>

<template>
  <main class="main">
    <AppHeader v-model:search="search" v-model:sort-by="sortBy" />

    <p class="summary">
      Total characters in SWAPI: {{ total }}
    </p>

    <p v-if="pending" class="status">
      Loading characters...
    </p>

    <p v-else-if="error" class="status status--error">
      Could not load characters.
      <button type="button" class="link-button" @click="refresh()">
        Retry
      </button>
    </p>

    <template v-else>
      <PeopleGrid
        :people="sortedPeople"
        @select-person="openPersonModal"
        @select-planet="openPlanetModal"
      />

      <p v-if="!sortedPeople.length" class="status">
        No matching results.
      </p>

      <nav class="pagination" aria-label="Pagination">
        <button type="button" :disabled="!hasPreviousPage" @click="previousPage">
          Previous
        </button>
        <button type="button" :disabled="!hasNextPage" @click="nextPage">
          Next
        </button>
      </nav>
    </template>

    <p v-if="planetLoading" class="status">
      Loading planet details...
    </p>

    <EntityModal
      :person="selectedPerson"
      :planet="selectedPlanet"
      :mode="modalMode"
      @close="closeModal"
      @open-planet="openPlanetFromPersonModal"
    />
  </main>
</template>
