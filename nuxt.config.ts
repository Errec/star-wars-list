export default defineNuxtConfig({
  compatibilityDate: '2025-04-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    swapiBaseUrl: 'https://swapi.dev/api'
  },
  typescript: {
    strict: true,
    typeCheck: true
  }
})
