<script setup lang="ts">
import type { Person, PlanetDetails } from '~/types/swapi'

const props = defineProps<{
  person: Person | null
  planet: PlanetDetails | null
  mode: 'person' | 'planet' | null
}>()

const emit = defineEmits<{
  close: []
  openPlanet: []
}>()

const isOpen = computed(() => Boolean(props.mode))
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
    <article class="modal-card">
      <button class="modal-close" type="button" aria-label="Close modal" @click="emit('close')">
        ×
      </button>

      <section v-if="mode === 'person' && person" class="modal-content">
        <h2>{{ person.name }}</h2>
        <p>
          Planet:
          <button class="modal-link" type="button" @click="emit('openPlanet')">
            {{ person.planetName }}
          </button>
        </p>
        <ul>
          <li><strong>ID:</strong> {{ person.id }}</li>
          <li><strong>Gender:</strong> {{ person.gender }}</li>
          <li><strong>Birth Year:</strong> {{ person.birthYear }}</li>
          <li><strong>Height:</strong> {{ person.height }} cm</li>
          <li><strong>Mass:</strong> {{ person.mass }} kg</li>
        </ul>
      </section>

      <section v-else-if="mode === 'planet' && planet" class="modal-content">
        <h2>{{ planet.name }}</h2>
        <ul>
          <li><strong>ID:</strong> {{ planet.id }}</li>
          <li><strong>Terrain:</strong> {{ planet.terrain }}</li>
          <li><strong>Population:</strong> {{ planet.population }}</li>
          <li><strong>Diameter:</strong> {{ planet.diameter }} km</li>
          <li>
            <strong>Residents:</strong>
            <span v-if="planet.residentsNames.length">{{ planet.residentsNames.join(', ') }}</span>
            <span v-else>unknown</span>
          </li>
        </ul>
      </section>
    </article>
  </div>
</template>
