# Nuxt Architecture Baseline

This project follows a Nuxt 3 standard layout:

- `pages/`: route views
- `components/`: reusable UI components
- `composables/`: reusable feature logic
- `server/api/`: Nitro server routes
- `server/middleware/`: Nitro middleware
- `types/`: domain model types
- `assets/`: global styles

## Deployment baseline

- Framework: Nuxt.js
- Build script: `nuxt build`
- Start script: `nuxt start`
- Postinstall: `nuxt prepare`
- Nitro preset: `vercel`

## Required environment variable

- `SWAPI_BASE_URL=https://swapi.dev/api`
