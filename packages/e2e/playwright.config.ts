import { defineConfig } from "@playwright/test";

const BACKEND_ENV = {
  BACKEND_URL: "http://127.0.0.1:7071/api",
  VITE_API_BASE_URL: "http://127.0.0.1:7071/api",
  VITE_SUPPLY_GRAPH_AI_URL: "http://localhost:8001",
};

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  retries: 0,
  // Nuxt dev mode compiles routes on demand; first hits of a page/component
  // JS chunk can take a few seconds. Default 5s expect timeout is too tight
  // for that (confirmed via a standalone diagnostic run where the same
  // click/nav succeeded once given more time) — this is dev-server latency,
  // not app behavior, so we widen the assertion timeout rather than the app.
  expect: { timeout: 15000 },
  reporter: [["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  // Reuses the back end / front end if they're already running locally
  // (they are, most of this session) instead of relaunching and hitting
  // EADDRINUSE — only spawns fresh servers in CI, where the ports are free.
  webServer: [
    {
      command: "npm run start",
      cwd: "../back-end",
      url: "http://127.0.0.1:7071/api/test",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: "npm run dev",
      cwd: "../front-end",
      url: "http://localhost:3000",
      env: BACKEND_ENV,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
  ],
});
