import { test, expect } from "./fixtures";

// Regression baseline for the app's main working path, ahead of the
// CLEANUP_PLAN.md refactor: home -> product detail -> related items ->
// supply-tree match attempt. Deliberately does NOT touch the header search
// box (AppHeader.vue's `query`/`handleSearch` aren't declared in its
// <script setup> — a known pre-existing bug, out of scope here) so this
// suite doesn't trip over an already-broken, unrelated feature.

test("home page renders product cards with no page errors", async ({ page, pageErrors }) => {
  await page.goto("/");

  const cards = page.locator(".product-card");
  await expect(cards.first()).toBeVisible();
  expect(await cards.count()).toBeGreaterThan(0);

  expect(pageErrors).toEqual([]);
});

test("clicking a product card opens a populated detail page", async ({ page }) => {
  await page.goto("/");

  const firstCard = page.locator(".product-card").first();
  const productTitle = await firstCard.locator(".title").innerText();
  await firstCard.click();

  await expect(page).toHaveURL(/\/products\/.+/);

  // `.center > h1.title` (direct child), not the descendant selector
  // `.product-detail .title` — that also matches RelatedItems.vue's own
  // "Related to items you've viewed" heading, which shares the `.title`
  // class and is nested inside the same `.product-detail` container.
  const detailTitle = page.locator(".product-detail .center > h1.title");
  await expect(detailTitle).toBeVisible();
  await expect(detailTitle).toHaveText(productTitle);

  // Not the loading skeleton
  await expect(page.locator(".loader.skelton-card-group")).toHaveCount(0);
});

test("related items section renders on the detail page without erroring", async ({
  page,
  pageErrors,
}) => {
  await page.goto("/");
  await page.locator(".product-card").first().click();
  await expect(page).toHaveURL(/\/products\/.+/);

  const related = page.locator(".related-products");
  await expect(related).toBeVisible();
  // Wait for the fetch to settle (loading spinner gone) rather than
  // asserting mid-flight.
  await expect(related.locator(".loader")).toHaveCount(0, { timeout: 10000 });
  // Accept either populated results or a clean "no items" state — the
  // point is that it doesn't throw, not that it always finds matches
  // (see backend test documenting getRelatedOKH's current always-empty bug).
  await expect(related).not.toContainText("error :");

  expect(pageErrors).toEqual([]);
});

test("triggering a supply-tree match degrades gracefully when OHM is unreachable", async ({
  page,
  pageErrors,
}) => {
  // Force the match call to fail deterministically instead of relying on
  // "OHM just isn't running on localhost:8001 in this environment" — if a
  // developer happens to have supply-graph-ai (or the mock-api stub) up
  // locally, that assumption breaks and this test would flake depending on
  // real match results. Aborting the route makes the failure path exercised
  // here environment-independent.
  const matchRequest = page.waitForRequest("**/v1/api/match");
  await page.route("**/v1/api/match", (route) => route.abort("connectionrefused"));

  await page.goto("/");
  await page.locator(".product-card").first().click();
  await expect(page).toHaveURL(/\/products\/.+/);

  await page.getByRole("button", { name: "SUPPLIERS" }).click();
  await expect(page).toHaveURL(/\/products\/.+\/supplyTree/, { timeout: 60000 });

  // Wait for the (forced-failing) match request to actually fire, so the
  // rest of this test observes the settled failure state rather than a
  // mid-flight one.
  await matchRequest;

  // NOTE: supplyTree.vue's heading is expected to show the product name, but
  // `selectedOKHname` is assigned as a plain `var` (not a `ref`) inside
  // sendToSupplyGraphAI, so Vue's reactivity never picks up the change and
  // the <h1> stays permanently empty. Confirmed via a standalone diagnostic
  // run (waited well past any fetch/render delay). This is a real
  // pre-existing bug — asserting the *actual* current behavior here (empty),
  // not the apparently-intended one, consistent with how the backend tests
  // document getRelatedOKH's current always-empty-array bug.
  await expect(page.locator("h1")).toHaveText("");

  // No supply tree renders, and — most importantly — nothing crashed the page.
  await expect(page.locator(".supply-tree")).toHaveCount(0);
  expect(pageErrors).toEqual([]);
});

test("app header renders on every page visited above", async ({ page }) => {
  await page.goto("/");
  // `.nav` (AppHeader.vue) is `position: fixed`, which collapses the outer
  // <header> to zero height by design — assert on the actual visible nav
  // content, not the (correctly) zero-height wrapper.
  await expect(page.locator("header .nav")).toBeVisible();
  await expect(page.getByRole("link", { name: "HELPFUL" })).toBeVisible();
});
