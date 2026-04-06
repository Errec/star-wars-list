<script setup lang="ts">
import type { Person } from '~/types/swapi'

defineProps<{
  people: Person[]
}>()

const emit = defineEmits<{
  selectPerson: [person: Person]
  selectPlanet: [person: Person]
}>()
</script>

<template>
  <ul class="people-grid">
    <li v-for="person in people" :key="person.id" class="people-grid__item">
      <button class="people-grid__name" type="button" @click="emit('selectPerson', person)">
        {{ person.name }}
      </button>
      <button class="people-grid__planet" type="button" @click="emit('selectPlanet', person)">
        {{ person.planetName }}
      </button>
    </li>
  </ul>
</template>
