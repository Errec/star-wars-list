# Star Wars List (Nuxt Migration)

This project was migrated from a legacy ES5 + Gulp implementation to a Nuxt 3 + TypeScript app while keeping the same user-facing behavior: list people, search, sort, and open person/planet details.

## Project review (legacy issues found)

The previous app worked, but had several technical issues:

- It queried `https://swapi.co/` (deprecated) instead of `https://swapi.dev/`.
- It fetched each person and each planet one-by-one on startup, causing many requests and slow initial rendering.
- Search was client-only and relied on loading the full dataset first.
- Error handling was mostly `console.log` with no user recovery path.
- Loading state was animation-only and not tied to actual API status.
- Data logic, DOM rendering, and event wiring were tightly coupled and hard to maintain.

## Migration sprints

The migration is split into small, doable sprints.

### Sprint 1 — Foundation and project setup
- Initialize Nuxt 3 with TypeScript strict mode.
- Configure scripts (`dev`, `build`, `start`, `preview`, `typecheck`).
- Add base app/layout scaffolding.

### Sprint 2 — API layer modernization
- Replace `swapi.co` with `swapi.dev`.
- Add server routes (`/api/sw/people`, `/api/sw/planet/:id`) to centralize API access.
- Add retry with exponential backoff for transient failures.
- Normalize SWAPI payloads into typed app models.

### Sprint 3 — UI parity with better loading/error handling
- Rebuild list/search/sort/modal in Vue components.
- Keep same output concepts (people list, planet column, details modal).
- Add explicit loading, empty, and error states with retry action.

### Sprint 4 — Data fetching and performance improvements
- Use SWAPI search + pagination instead of downloading every record.
- Fetch planet names only for people visible on the current page.
- Load planet details/residents only when user opens a planet modal.

### Sprint 5 — QA and release hardening
- Run typecheck/build validation.
- Update docs and environment requirements (Node LTS 18+).
- Prepare incremental follow-ups (tests, linting, CI) as next improvements.

## Tech stack

- Nuxt 3
- TypeScript
- Nitro server routes for API proxy/normalization
- Native `$fetch` for HTTP

## Running locally

```bash
npm install
npm run dev
```

Build and production preview:

```bash
npm run build
npm run preview
```

## Notes

- API source: [SWAPI documentation](https://swapi.dev/documentation).
- This implementation intentionally focuses on must-have improvements for a small project.
- Nice-to-have follow-ups: Pinia, Vitest/Playwright tests, ESLint/Prettier, CI pipeline.
