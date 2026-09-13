import { describe, it, expect, beforeAll } from "vitest";

// Black-box regression baseline against the real running func host (see README
// "Local development"). These capture *current observed behavior* so future
// refactors (CLEANUP_PLAN.md) don't silently change response shape, status
// codes, or CORS headers — they are not a spec of "correct" behavior.

const BASE_URL = process.env.API_BASE_URL || "http://127.0.0.1:7071/api";

async function fetchWithTimeout(url: string, ms: number, init?: RequestInit) {
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
    const res = await fetchWithTimeout(`${BASE_URL}/test`, 5000);
    if (!res.ok) throw new Error(`status ${res.status}`);
  } catch (err) {
    throw new Error(
      `Backend not reachable at ${BASE_URL} (${(err as Error).message}). ` +
        `Start it first: cd packages/back-end && npm run start`
    );
  }
}, 10000);

describe("GET /test", () => {
  it("returns the health-check body", async () => {
    const res = await fetch(`${BASE_URL}/test`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ test: true });
  });
});

describe("GET /listRoutes", () => {
  it("returns an array of route URLs including the known routes", async () => {
    const res = await fetch(`${BASE_URL}/listRoutes`);
    expect(res.status).toBe(200);
    const routes: string[] = await res.json();
    expect(Array.isArray(routes)).toBe(true);
    expect(routes.some((r) => r.endsWith("/listOKHsummaries"))).toBe(true);
    expect(routes.some((r) => r.endsWith("/incidents"))).toBe(true);
  });
});

describe("GET /listOKHsummaries", () => {
  it("returns OKH summaries shaped for the front end, with CORS headers", async () => {
    const res = await fetch(`${BASE_URL}/listOKHsummaries`);
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
    const res = await fetch(`${BASE_URL}/listOKWsummaries`);
    expect(res.status).toBe(200);
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
    const body = await res.json();
    expect(Array.isArray(body.summaries)).toBe(true);
  });
});

describe("GET /getFile/{containerName}/{fileName}/{fileType}", () => {
  it("downloads a known OKH file and returns it as { product }", async () => {
    const res = await fetch(
      `${BASE_URL}/getFile/okh/okh-chococolate-chip-cookies-recipe/json`
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.product).toBeTruthy();
    expect(body.product.title).toBe("Chocolate Chip Cookies");
  });
});

describe("GET /getRelatedOKH", () => {
  // Documents current (buggy) behavior: the route has no {keywords} path
  // template, so `request.params.keywords` is always `undefined`, and
  // `decodeURIComponent(undefined)` coerces to the literal string
  // "undefined" — the query string is never actually read. The effective
  // keyword filter is therefore always exactly ["undefined"], not [].
  // The result below is empty only because none of the current OKH files
  // happen to have "undefined" as a keyword — coincidental, not because the
  // parsed keyword list is empty. If a file is ever tagged "undefined" (or
  // this starts returning real query-based matches), that's worth a
  // deliberate look, not a silent regression.
  it("currently always returns an empty relatedOKH list, regardless of the query string", async () => {
    const res = await fetch(`${BASE_URL}/getRelatedOKH?keywords=cookies`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ relatedOKH: [] });
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
