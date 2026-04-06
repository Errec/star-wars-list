# Deploy Readiness Review (Nuxt 3 migration)

Date: 2026-04-06

## Overall status

**Conditional Go** ✅

The codebase is now structurally ready for merge/deploy to Vercel, with one external blocker in this environment: npm registry access is blocked, so install/build/test could not be executed here.

## What was reviewed

- App architecture and Nuxt folder layout
- API integration and SWAPI endpoint usage (`swapi.dev`)
- Loading/error states and user-facing recovery
- Server-side error behavior and resilience
- Basic security headers and runtime config handling
- DX baseline (scripts, env template, lint/format/test scaffolding)

## Findings

### High priority

1. **Environment cannot install dependencies (external blocker)**
   - `npm install` returns `403 Forbidden` in this environment.
   - Impact: build/lint/test commands cannot be validated here.
   - Action: run install/build in CI or local machine with registry access before merging.

### Medium priority

2. **No explicit Vercel project config file**
   - Nuxt generally auto-detects well on Vercel.
   - Optional action: add `vercel.json` only if project-specific routing/runtime controls are needed.

## Ready-for-merge checklist

- [x] Legacy build stack removed
- [x] Nuxt 3 + TypeScript strict config in place
- [x] SWAPI source updated to `https://swapi.dev`
- [x] Server API endpoints centralize data access
- [x] Loading + empty + error states in UI
- [x] Global error page available
- [x] Health endpoint exists (`/api/health`)
- [x] Request logging middleware present
- [x] Runtime config + env template present
- [ ] Install/build/typecheck verified in CI/local with registry access
- [ ] Add meaningful test coverage before first production release

## Recommended pre-merge commands (run where npm registry access works)

```bash
npm install
npm run typecheck
npm run build
```

## Vercel deployment notes

- Framework: Nuxt (auto-detected)
- Required env var:
  - `SWAPI_BASE_URL=https://swapi.dev/api`
- Healthcheck endpoint after deploy:
  - `https://<your-domain>/api/health`
