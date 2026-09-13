import { describe, it, expect, beforeAll } from "vitest";

// Black-box regression baseline against the real running func host (see README
// "Local development"). These capture *current observed behavior* so future
// refactors (CLEANUP_PLAN.md) don't silently change response shape, status
// codes, or CORS headers — they are not a spec of "correct" behavior.
//
// The backend is blob-backed by a shared, mutable Azure Storage account (see
// issue #94 — OKH/OKW files are actively being reformatted), so every request
// below goes through fetchWithTimeout and avoids hardcoding specific file
// names/titles where a test can instead discover real data at run time and
// assert internal consistency.

const BASE_URL = process.env.API_BASE_URL || "http://127.0.0.1:7071/api";
const DEFAULT_TIMEOUT_MS = 5000;

async function fetchWithTimeout(url: string, ms: number = DEFAULT_TIMEOUT_MS, init?: RequestInit) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

beforeAll(async () => {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/test`);
    if (!res.ok) throw new Error(`status ${res.status}`);
  } catch (err) {
    throw new Error(
      `Backend not reachable at ${BASE_URL} (${(err as Error).message}). ` +
        `Start it first: cd packages/back-end && npm run start`
    );
  }
}, 10000);

// Discovers a real, currently-existing OKH file (rather than hardcoding one —
// the blob contents are live data actively being migrated, issue #94) and
// downloads its full manifest.
async function discoverRealOkhFile() {
  const listRes = await fetchWithTimeout(`${BASE_URL}/listOKHsummaries`);
  const { summaries } = await listRes.json();
  expect(summaries.length).toBeGreaterThan(0);
  const [summary] = summaries;

  // fname is "<name>.<ext>" (see getFileNameAndFileType) — split it back
  // into the {fileName}/{fileType} path segments /getFile expects.
  const lastDot = summary.fname.lastIndexOf(".");
  const fileName = summary.fname.slice(0, lastDot);
  const fileType = summary.fname.slice(lastDot + 1);

  const res = await fetchWithTimeout(`${BASE_URL}/getFile/okh/${fileName}/${fileType}`);
  const body = await res.json();
  return { summary, res, product: body.product };
}

describe("GET /test", () => {
  it("returns the health-check body", async () => {
    const res = await fetchWithTimeout(`${BASE_URL}/test`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ test: true });
  });
});

describe("GET /listRoutes", () => {
  it("returns an array of route URLs including the known routes", async () => {
    const res = await fetchWithTimeout(`${BASE_URL}/listRoutes`);
    expect(res.status).toBe(200);
    const routes: string[] = await res.json();
    expect(Array.isArray(routes)).toBe(true);
    expect(routes.some((r) => r.endsWith("/listOKHsummaries"))).toBe(true);
    expect(routes.some((r) => r.endsWith("/incidents"))).toBe(true);
  });
});

describe("GET /listOKHsummaries", () => {
  it("returns OKH summaries shaped for the front end, with CORS headers", async () => {
    const res = await fetchWithTimeout(`${BASE_URL}/listOKHsummaries`);
    expect(res.status).toBe(200);
    expect(res.headers.get("access-control-allow-origin")).toBe("*");

    const body = await res.json();
    expect(Array.isArray(body.summaries)).toBe(true);
    expect(body.summaries.length).toBeGreaterThan(0);

    const item = body.summaries[0];
    expect(item).toHaveProperty("id");
    expect(item).toHaveProperty("fname");
    expect(item).toHaveProperty("name");
    expect(item).toHaveProperty("shortDescription");
    expect(item).toHaveProperty("manifestAuthor");
  });
});

describe("GET /listOKWsummaries", () => {
  it("returns an OKW summaries array, with CORS headers", async () => {
    const res = await fetchWithTimeout(`${BASE_URL}/listOKWsummaries`);
    expect(res.status).toBe(200);
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
    const body = await res.json();
    expect(Array.isArray(body.summaries)).toBe(true);
  });
});

describe("GET /getFile/{containerName}/{fileName}/{fileType}", () => {
  it("downloads a real OKH file (discovered via /listOKHsummaries) and returns it as { product }", async () => {
    const { summary, res, product } = await discoverRealOkhFile();
    expect(res.status).toBe(200);
    expect(product).toBeTruthy();
    // Cross-check against the summary rather than a hardcoded title, so this
    // fails only if /getFile and /listOKHsummaries actually disagree about
    // the same file, not if the underlying blob content changes.
    expect(product.title).toBe(summary.name);
  });
});

describe("GET /getRelatedOKH", () => {
  // CORRECTION: an earlier version of this test (and dev-docs/CLEANUP_PLAN.md,
  // TESTING.md, AGENT.md, and issue #107) claimed this endpoint always ignores
  // the `keywords` query param because the route has no `{keywords}` path
  // template, reasoning that `request.params.keywords` must therefore be
  // `undefined`. That reasoning was wrong: `HttpRequest.params` in this
  // Azure Functions host is populated straight from the invocation's RPC
  // binding data, and — empirically verified — that binding data includes
  // query-string values even without a matching route template segment. So
  // `?keywords=cookie%20-%20chocolate` genuinely reaches `request.params.keywords`
  // and the endpoint's exact-token, case-insensitive keyword matching
  // (`hasOverlapKeywords`/`normalizeKeywords`) works as intended. The
  // earlier "always empty" observation was real but coincidental: every
  // keyword tried before ("cookies", "undefined", random strings) simply
  // didn't exact-match any real file's keyword field.
  it("filters by keyword: an exact match returns the file, an unrelated one doesn't", async () => {
    const { product } = await discoverRealOkhFile();
    const [realKeyword] = product.keywords ?? [];
    expect(realKeyword).toBeTruthy();

    const [resMatch, resNoMatch] = await Promise.all([
      fetchWithTimeout(`${BASE_URL}/getRelatedOKH?keywords=${encodeURIComponent(realKeyword)}`),
      fetchWithTimeout(`${BASE_URL}/getRelatedOKH?keywords=no-such-keyword-${crypto.randomUUID()}`),
    ]);
    expect(resMatch.status).toBe(200);
    expect(resNoMatch.status).toBe(200);

    const { relatedOKH: matched } = await resMatch.json();
    const { relatedOKH: notMatched } = await resNoMatch.json();
    expect(matched.some((item: { title?: string; name?: string }) => item.name === product.title)).toBe(true);
    expect(notMatched).toEqual([]);
  });
});

describe("GET /incidents", () => {
  // No local Postgres by default (see README) — this documents rather than
  // requires DB availability, and never lets a hang hold up the whole suite.
  it("either returns incident rows or fails without hanging (DB not configured locally)", async () => {
    try {
      const res = await fetchWithTimeout(`${BASE_URL}/incidents`, 5000);
      expect([200, 500]).toContain(res.status);
      if (res.status === 200) {
        expect(Array.isArray(await res.json())).toBe(true);
      }
    } catch (err) {
      // Timeout/abort is the current known behavior with no DB configured
      // (getIncidents has no error handling around pool.query) — acceptable
      // here, tracked as a real bug to fix in CLEANUP_PLAN.md Phase 3.
      expect((err as Error).name).toBe("AbortError");
    }
  }, 7000);
});
