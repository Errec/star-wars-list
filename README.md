# Star Wars List (Nuxt 3)

A Nuxt 3 + TypeScript remake of the legacy Star Wars list app.

## What was improved

- Migrated from legacy ES5/Gulp stack to Nuxt 3 + Vite + TypeScript strict mode.
- Updated API source from deprecated `swapi.co` to `https://swapi.dev`.
- Removed full-dataset client loading for search and switched to SWAPI search + pagination.
- Added Nitro server endpoints (`/api/sw/people`, `/api/sw/planet/:id`) to centralize API calls.
- Added retry + simple circuit-breaker behavior for unstable upstream API responses.
- Added explicit loading, empty-state, retry, and global error page handling.
- Added request logging middleware and healthcheck endpoint (`/api/health`).

## Migration sprints

### Sprint 1 — Foundation
- Nuxt 3 app, TypeScript strict mode, app/layout shell.

### Sprint 2 — Data layer
- Server-side API endpoints, typed models, SWAPI URL updates.

### Sprint 3 — UX parity
- Search, sort, list, modal details (person/planet) with similar output.

### Sprint 4 — Reliability + observability
- Retry/backoff, circuit breaker, request logs, error page.

### Sprint 5 — Release hygiene
- Environment template, deployment checklist, and legacy asset cleanup.

## Project structure

- `assets/` global CSS
- `components/layout/` page-level composed UI
- `composables/` SWAPI feature logic (`useSwapi`)
- `pages/` Nuxt routes
- `server/` API routes, middleware, utilities
- `types/` TypeScript domain models
- `plugins/` app-level error handler

## Environment

Copy `.env.example` to `.env` when needed.

```bash
SWAPI_BASE_URL=https://swapi.dev/api
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run preview
npm run typecheck
```

## API source

- SWAPI docs: https://swapi.dev/documentation


## Deploy review

- See `docs/deploy-review.md` for merge/deploy checklist and risk summary.
