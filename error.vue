<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const resetApp = async () => {
  await clearError({ redirect: '/' })
}
</script>

<template>
  <main class="main">
    <h1>Something went wrong</h1>
    <p>{{ props.error.statusCode }} — {{ props.error.statusMessage || 'Unexpected error' }}</p>
    <button type="button" class="link-button" @click="resetApp">
      Go back home
    </button>
  </main>
</template>
