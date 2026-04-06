<script setup lang="ts">
import type { SortField } from '~/composables/useSwapi'

const search = defineModel<string>('search', { required: true })
const sortBy = defineModel<SortField>('sortBy', { required: true })
</script>

<template>
  <header class="header">
    <h1>Star Wars List</h1>
    <div class="header__controls">
      <input
        v-model="search"
        type="search"
        class="header__input"
        placeholder="Search by person or planet"
        aria-label="Search people"
      >

      <select v-model="sortBy" class="header__select" aria-label="Sort list by">
        <option value="id">
          Id
        </option>
        <option value="planetName">
          Planet
        </option>
        <option value="name">
          Name
        </option>
      </select>
    </div>
  </header>
</template>
