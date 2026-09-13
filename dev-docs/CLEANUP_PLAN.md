# Codebase Cleanup & Hardening Plan

## Context

The repo (Nuxt 3 front end + Azure Functions/TypeScript back end, Postgres + Azure Blob Storage) grew organically. At the start of this effort it had no CI, no automated tests, no lint/format enforcement, and no lockfiles for any package except `atoms` — **Phase 0 below tracks closing each of those gaps**, don't take this sentence as still describing the current state. A prior audit (`ARCHITECTURE_ANALYSIS.md`) and direct code review confirmed further real problems in both layers, listed below. This document is the durable, versioned record of scope, phases, and status — check off phases as they land.

**Goal:** raise the codebase to a maintainable baseline — remove dead weight, centralize config, stop obvious bugs, and add just enough safety net (lint, build check, minimal tests, a smoke-test checklist) — **without changing observable behavior of any working feature.**

**Execution model:** phase-by-phase, with a checkpoint (build/lint/smoke-test + explicit go-ahead) after each phase. No phase starts until the previous one is confirmed clean. Known broken stubs are **filed as issues, not fixed here**, to keep this effort pure cleanup/hardening (see "Explicitly out of scope" below).

---

## Findings

### Back end (`packages/back-end/src/functions/httpFunctions.ts`, `src/db.ts`, `src/lib/azure-storage.ts`)
- Dead/duplicate code: `listFilesByContainerName` calls `listFilesInContainer` twice — once in a throwaway block (`httpFunctions.ts:107-113`) whose result is discarded.
- Commented-out routes and functions (`httpFunctions.ts:44-46`, `azure-storage.ts:23-53`).
- Inconsistent CORS: some handlers set `Access-Control-Allow-Origin: *`, others set nothing, others set a fuller header set — three different patterns copy-pasted.
- `getIncidents` has zero error handling around `pool.query` — a DB hiccup becomes an unhandled rejection.
- `GET /getRelatedOKH` (`httpFunctions.ts:150`) always returns `{ relatedOKH: [] }` regardless of the `keywords` query param — the route is registered with no `{keywords}` path template, so `request.params.keywords` is always `undefined`, and `decodeURIComponent(undefined)` coerces to the literal string `"undefined"`, so the effective keyword filter is always `["undefined"]`, not `[]`. The empty result today is coincidental (no current OKH file is tagged `"undefined"`), not because no keywords were parsed. Confirmed live (`curl .../getRelatedOKH?keywords=cookies` → empty array) and captured as a baseline assertion in `packages/back-end/test/api.test.ts`.
- Unbounded in-memory cache (`getOKHByFileName`) with a comment saying it's temporary.
- `db.ts` hardcodes `ssl: { rejectUnauthorized: false }` unconditionally.
- Heavy `any` typing; leftover debug logging (`context.log("XXX", ...)`, `context.log("AAA", ...)`, bare `console.log`s in `getRelatedOKH`/`listSummaries`).

### Front end (`packages/front-end`)
- Hardcoded production URLs baked in as fallback defaults in `nuxt.config.ts` (Azure Container Apps URLs), then re-hardcoded *differently* in `detailedcrisis.vue:243` and `supply-graph-api.vue:19` (`http://localhost:7071/api`), and again in `utils/ohmMatch.ts` (own OHM URL fallback duplicated from `nuxt.config.ts`). Three sources of truth for two config values — this is the root of open issue #103.
- Duplicated business logic: the OHM "send to supply graph AI" flow is near-duplicated between `supply-graph-api.vue:110-159` and `products/[id]/supplyTree.vue:28-85`.
- Duplicated CSS (loading-spinner block copy-pasted across `index.vue`, `products/[id]/index.vue`, `RelatedItems.vue`).
- Dead/commented code blocks (`RelatedItems.vue:55-95` mock array, `D3Tree.vue:67-68,111,141-147`, `AppHeader.vue:56-65`, `index.vue:23-37`).
- `products/[id]/supplyTree.vue`'s heading is bound to `selectedOKHname`, which is declared as a plain `var` (not a `ref`) and assigned inside `sendToSupplyGraphAI` — Vue's reactivity never picks up the change, so the `<h1>` renders permanently empty regardless of how long the match request takes. Confirmed via a standalone diagnostic Playwright run; asserted as current behavior in `packages/e2e/tests/main-workflow.spec.ts`.
- No ESLint/Prettier config at all; `tsconfig.json` just extends the Nuxt-generated one with no strictness.
- Broken stubs — **out of scope, tracked as issues instead**: `AppHeader.vue` search box wired to non-existent `query`/`handleSearch`; `login.vue`/`register.vue` no-op submit handlers; three orphan pages (`detailedcrisis.vue`, `homepage.vue`, `supply-graph-api.vue`) not linked from nav; `homepage.vue:17` has a markup typo (`<IncidentsCard />cd`).

### Repo-wide
- No `.github/workflows` — nothing mechanically catches a regression today.
- `package-lock.json` gitignored for `back-end`, `front-end`, `mock-api` (only `atoms` has one committed) — installs aren't reproducible.
- ~~Zero test files anywhere in the repo.~~ **Done** — see `TESTING.md`: `packages/back-end/test/` (vitest: unit + black-box API) and `packages/e2e` (Playwright main-workflow suite).

---

## Phase 0 — Safety net (must land first)

- [ ] **Lockfiles**: un-ignore `package-lock.json` (remove from `.gitignore`), run `npm install` in `packages/back-end`, `packages/front-end`, `packages/mock-api`, commit the generated lockfiles (no version bumps).
- [ ] **Minimal CI** (`.github/workflows/ci.yml`): on push/PR, `npm ci && npm run build` for back-end and front-end, plus the test suites below. Catches most real regressions for free.
- [ ] **Lint/format baseline**: add ESLint (+ `@typescript-eslint`) and Prettier to `packages/back-end` and `packages/front-end`, starting as warnings (not build-breaking) so it doesn't block on today's `any` usage. Add `lint` npm scripts.
- [x] **Automated tests** (upgraded from the original "minimal unit tests + manual checklist" plan — see `TESTING.md` for full detail):
  - Back end (`packages/back-end`, vitest): unit tests for `getFileNameAndFileType`, `hasOverlapKeywords`, `normalizeKeywords`, `convertToProduct`; black-box API tests against the real running func host covering `/test`, `/listRoutes`, `/listOKHsummaries`, `/listOKWsummaries`, `/getFile`, `/getRelatedOKH`, `/incidents`. `npm test` → 20/20 passing.
  - Front end (`packages/e2e`, Playwright): main-workflow spec covering home → product detail → related items → supply-tree match attempt → header. 5/5 passing.
  - Two real pre-existing bugs surfaced and captured as regression baselines while building these (see Findings above): `getRelatedOKH` always-empty, and `supplyTree.vue`'s non-reactive `selectedOKHname`.

**Checkpoint:** CI green (still pending), `npm run build` succeeds in both packages, all tests pass. Go-ahead required before Phase 1.

## Phase 1 — Dead code & mechanical cleanup (behavior-preserving by construction)

- [ ] Back end: delete the discarded duplicate `listFilesInContainer` call block, delete commented-out routes/functions, remove debug `console.log`/`context.log("XXX"/"AAA", ...)` calls (keep meaningful error logs).
- [ ] Front end: remove commented-out mock array (`RelatedItems.vue`), dead code in `D3Tree.vue`, commented nav links in `AppHeader.vue` (confirm intent at checkpoint before deleting), dead blocks in `index.vue`.
- [ ] Extract the duplicated loading-spinner CSS into one shared class/component.
- [ ] Fix the `homepage.vue:17` markup typo (page is a static orphan, so this is visual-only).

**Checkpoint:** re-run smoke checklist + CI. Nothing here should change any API response or rendered output except removing the visible typo artifact.

## Phase 2 — Centralize configuration (highest-risk phase)

- [ ] Make `runtimeConfig.public.baseUrl` / `supplyGraphAiUrl` (from `nuxt.config.ts`) the single source of truth; update `detailedcrisis.vue` and `supply-graph-api.vue` to read from `useRuntimeConfig()` instead of hardcoding `http://localhost:7071/api`; update `utils/ohmMatch.ts` to reuse `supplyGraphAiUrl` instead of its own fallback constant.
- [ ] Add `packages/front-end/.env.example` and `packages/back-end/.env.example` documenting every required var (`BACKEND_URL`, `SUPPLY_GRAPH_AI_URL`, `Azure_Storage_*`, `PG*`, `AzureWebJobsStorage`), addressing open issue #103.
- [ ] Do **not** change actual default values/URLs — only consolidate where they're read from, so behavior is identical to today in both local and prod configs.

**Checkpoint:** run both packages locally against real backend/OHM URLs and against `.env` overrides; confirm identical behavior via smoke checklist.

## Phase 3 — Back-end hardening

- [ ] Wrap `getIncidents`'s `pool.query` in try/catch, return a proper 500 with an error body instead of throwing.
- [ ] Centralize the three CORS header patterns into one helper, applied consistently — keep the allowed origin/methods identical to today (still `*`; tightening CORS is a follow-up issue, not silent scope creep here).
- [ ] Add a size/TTL cap to the in-memory `getOKHByFileName` cache instead of removing caching.
- [ ] Leave `rejectUnauthorized: false` as-is, add a comment explaining why (self-signed Azure Postgres cert), file a follow-up issue for proper CA pinning.

**Checkpoint:** re-run incidents/listFiles/getFile/getRelatedOKH smoke tests; confirm CORS headers unchanged in a browser network tab.

## Phase 4 — Type safety (incremental, lowest priority)

- [ ] Add a shared `OKH`/`OKW` type (addresses long-open issue #45) used by `convertToProduct`, `getOKHByFileName`, and front-end product pages in place of `any` where practical.
- [ ] Reduce `any` in `supplyTree.vue`, `supply-graph-api.vue`, `utils/utils.ts` opportunistically — skip anywhere it would require guessing at unverified OHM API response shapes.

**Checkpoint:** `npm run build` + lint clean, smoke checklist passes.

---

## Explicitly out of scope (tracked as GitHub issues instead)

- AppHeader search box wired to non-existent `query`/`handleSearch`.
- `login.vue`/`register.vue` no-op submit handlers.
- Orphan pages (`detailedcrisis.vue`, `homepage.vue`, `supply-graph-api.vue`) not linked from nav.
- CORS tightening beyond header consolidation (still wildcard for now).
- Proper Postgres CA cert pinning.

These will be filed as issues (title + description, referencing the exact files/lines above) once Phase 3/4 land, so they don't get lost but also don't block or scope-creep this cleanup.

---

## Verification approach (every phase)

1. `npm run build` succeeds for back-end and front-end.
2. Unit tests from Phase 0 pass.
3. Manual smoke checklist passes locally against real dev config.
4. Diff review confirms no unintended behavior change — only deletions of dead code or consolidation of duplicated logic into one call site.

Each phase ends with an explicit checkpoint and a request for go-ahead before the next phase begins.
