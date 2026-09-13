# Testing

Regression safety net for the `CLEANUP_PLAN.md` refactor: an API test suite for the back end and a browser-driven workflow suite for the front end. Both are net-new — there were zero tests in this repo before this.

## Backend API tests (`packages/back-end`)

```bash
cd packages/back-end
npm run start          # start the func host first (see README)
npm run test           # runs test:unit then test:api
# or individually:
npm run test:unit      # pure-function unit tests, no server needed
npm run test:api       # black-box tests against http://127.0.0.1:7071/api
```

`test:api` does a quick reachability check first and fails fast with a clear message if the backend isn't running — it does **not** auto-start the server (avoids port conflicts if you already have `func start` running, which is the common case during development).

**What's covered:** `/test`, `/listRoutes`, `/listOKHsummaries`, `/listOKWsummaries`, `/getFile/{container}/{file}/{type}`, `/getRelatedOKH`, `/incidents`.

**What these tests are (and aren't):** they assert *today's actual observed behavior* as a baseline, including two known bugs, so future refactors don't change them silently:
- `GET /getRelatedOKH` always returns `{ relatedOKH: [] }` regardless of the `keywords` query param — the route has no `{keywords}` path template, so `request.params.keywords` is always `undefined`, and `decodeURIComponent(undefined)` coerces to the literal string `"undefined"`. The effective keyword filter is therefore always `["undefined"]`, not `[]` — the empty result is because no current OKH file happens to be tagged `"undefined"`, not because no keywords were parsed.
- `GET /incidents` has no error handling around the Postgres query; with no local DB configured it aborts/errors rather than hanging the suite (also tracked in `CLEANUP_PLAN.md` Phase 3).

If either of those ever starts behaving differently, that's worth a deliberate look — not necessarily a break.

## Frontend E2E tests (`packages/e2e`)

```bash
cd packages/e2e
npx playwright install chromium   # one-time browser download
npx playwright test               # or: npm test
npx playwright show-report        # view the HTML report after a run
```

Playwright's config auto-starts the back end (`func start`) and front end (`nuxt dev`) if they're not already running, and reuses them if they are (the common case in dev — this is how the suite was developed, against already-running servers).

**Main workflow covered:** home page → product cards render → click into a product detail page → related items section → trigger a supply-tree match. Orphan pages not linked from navigation (`homepage.vue`, `detailedcrisis.vue`, `supply-graph-api.vue`) and known-broken stubs (header search box, login/register) are intentionally not covered — see `CLEANUP_PLAN.md`'s "Explicitly out of scope" list.

**Known gaps documented by the suite, not hidden by it:**
- No local OHM (`supply-graph-ai`) by default — the supply-tree test asserts the failure path degrades gracefully (no crash) rather than requiring a real match result.
- `supplyTree.vue`'s heading (`selectedOKHname`) is assigned as a plain `var`, not a `ref`, so it never updates reactively and stays empty — confirmed via a standalone diagnostic run, asserted here as current behavior. Real bug, not yet fixed (candidate for a `CLEANUP_PLAN.md` addendum or a tracked issue).
- The outer `<header>` element has zero height by design (`.nav` inside it is `position: fixed`) — tests assert on `.nav`/its content, not the wrapper.

## Not yet done

- Neither suite is wired into CI yet (`.github/workflows` doesn't exist) — that's `CLEANUP_PLAN.md` Phase 0. Once it lands, these two suites are what it should run.
- No Postgres or OHM instance is stood up for local testing — both suites degrade gracefully without them by design.

## Re-running after each cleanup phase

Both suites are the regression gate for `CLEANUP_PLAN.md`: re-run `npm test` in `packages/back-end` and `npx playwright test` in `packages/e2e` after every phase before moving to the next.
