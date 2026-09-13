# Agent notes — project-data-platform-ts

Orientation for any AI coding agent working in this repo. Full context lives in `dev-docs/` — read that before making non-trivial changes.

## What this is

A monorepo (no root `package.json` — each package installs/runs independently) for a disaster-response supply-matching platform: Nuxt 3/Vue front end + Azure Functions (TypeScript) back end, backed by Azure Blob Storage (public OKH/OKW library data) and PostgreSQL, calling out to a separate matching service (`supply-graph-ai` / OHM, not in this repo).

| Package | Purpose |
|---|---|
| `packages/back-end` | Azure Functions API (`:7071`) |
| `packages/front-end` | Nuxt UI (`:3000`) |
| `packages/e2e` | Playwright browser tests against the two above |
| `packages/mock-api` | Optional stub for OHM, port conflicts with the real thing |
| `packages/pdweb-backend-unconnected` | Old/experimental, not wired into anything |
| `atoms` | Shared reference types (not yet consumed by the other packages — see open issue #45) |

See the root `README.md` for full local-dev setup steps (env vars, `local.settings.json`, OHM wiring).

## Before changing code

1. Read `dev-docs/CLEANUP_PLAN.md` — the living record of known issues and the phased plan to address them without breaking behavior. Check its checkboxes before assuming something is still broken.
2. Read `dev-docs/TESTING.md` and run both test suites before *and* after your change:
   ```bash
   cd packages/back-end && npm run start   # separate terminal, leave running
   cd packages/back-end && npm test        # 13 unit + 7 API tests
   cd packages/e2e && npx playwright test  # 5 browser workflow tests
   ```
   These exist specifically to catch accidental behavior changes during refactors — treat a suite going from green to red as a signal to investigate, not to loosen the assertion.
3. `dev-docs/ARCHITECTURE_ANALYSIS.md` and `dev-docs/CONTAINERIZATION_CHECKLIST.md` are earlier audits of the same codebase; still accurate as of the last update but not living documents like `CLEANUP_PLAN.md`.

## Known sharp edges (don't rediscover these the hard way)

- **`packages/back-end`'s dependency versions must stay compatible with each other.** A plain `npm install` without the committed lockfile could still pull dependency versions that don't compile — this already happened once (`typescript` was pinned to `^4.0.0` while `@azure/*`/`pg`'s installed type definitions needed TS 5+; fixed by bumping to `^5.7.3` and `@types/node` to `^22.x` to match the actual Node runtime). `packages/back-end/package-lock.json` is now committed specifically to prevent this recurring — always `npm ci`, not `npm install`, when you just need a clean reproducible install.
- **`packages/back-end/tsconfig.json` excludes `test/` and `vitest.config.mts`.** Don't remove that exclude — without it, `tsc` sweeps vitest's type declarations into the compile and fails (`TS2307` on `vite`/`vitest/browser`/etc.), breaking `npm run build` and therefore `npm start`.
- **`packages/back-end/local.settings.json.template` has an inline `//` comment**, which is invalid JSON. Strip it after copying to `local.settings.json`, or `func start` (and JSON.parse in general) will choke on it.
- **`GET /getRelatedOKH` actually does work, despite having no `{keywords}` path template.** It's tempting to reason "no route template means `request.params.keywords` must be `undefined`" — that reasoning is wrong here and led to a real misdiagnosis in this repo's history (see issue #107, closed with the correction). This Azure Functions host's RPC binding data flattens query-string values into `request.params` even without a matching route segment, so `?keywords=...` genuinely reaches the handler, and its case-insensitive exact-token matching (`hasOverlapKeywords`/`normalizeKeywords`) works as intended. Verify empirically before trusting a "params must be undefined" argument for *any* route in this file.
- **`packages/front-end/pages/products/[id]/supplyTree.vue`'s heading never renders.** `selectedOKHname` is a plain `var`, not a `ref`, so Vue's reactivity never picks up the assignment. Captured as a baseline in `packages/e2e/tests/main-workflow.spec.ts`, tracked as issue #108, not yet fixed.
- **CI (`.github/workflows/ci.yml`) covers build + unit tests only** — it deliberately does not run the backend's `test:api` suite or the Playwright E2E suite (both need live Azure data and/or a browser download, which don't fit a minimal hermetic gate). A green CI run does not mean those two suites pass; run them locally too (see `dev-docs/TESTING.md`). Lint config and `.env.example` files are still not done (`CLEANUP_PLAN.md` Phase 0/2).
- **Two dev servers are commonly left running during a session** (`func start` on `:7071`, `nuxt dev` on `:3000`). `packages/e2e/playwright.config.ts` reuses them if present (`reuseExistingServer: !process.env.CI`) rather than relaunching — don't add a second auto-start mechanism (e.g. `start-server-and-test`) for the back-end test suite, it will hit `EADDRINUSE`.

## Conventions this repo already uses

- Root-level `*.md` docs beyond `README.md`/`LICENSE` live in `dev-docs/`, not the repo root — **except this file**. `AGENT.md` is deliberately kept at the root because that's the conventional location coding agents look for orientation docs; don't move it into `dev-docs/` while applying this rule to something else.
- No root `package.json` — always `cd` into the specific package before running `npm`.
