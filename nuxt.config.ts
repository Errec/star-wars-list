export default defineNuxtConfig({
  compatibilityDate: '2025-04-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    swapiBaseUrl: process.env.SWAPI_BASE_URL || 'https://swapi.dev/api',
    public: {
      appName: 'Star Wars List'
    }
  },
  routeRules: {
    '/api/**': {
      headers: {
        'cache-control': 's-maxage=60, stale-while-revalidate=300',
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'DENY',
        'referrer-policy': 'strict-origin-when-cross-origin'
      }
    }
  },
  typescript: {
    strict: true,
    typeCheck: true
  },
  nitro: {
    preset: 'vercel'
  }
})
