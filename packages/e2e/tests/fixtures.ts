import { test as base } from "@playwright/test";

// Shared `pageErrors` fixture: collects uncaught page errors for the
// duration of a test so specs can assert `expect(pageErrors).toEqual([])`
// without each repeating the same `page.on("pageerror", ...)` wiring.
export const test = base.extend<{ pageErrors: Error[] }>({
  pageErrors: async ({ page }, use) => {
    const errors: Error[] = [];
    page.on("pageerror", (err) => errors.push(err));
    await use(errors);
  },
});

export { expect } from "@playwright/test";
