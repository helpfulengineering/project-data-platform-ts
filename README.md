# Project Data Platform

This is a work in progress.

We are currently attempting to build a website to address broken supply chains, such as occur during natural disasters.
This is an attempt to build a website that allows makers and manufacturers to match demand for necessary articles which
they can make.
This matching of demand to supply is a fundamental human problem that could allow lives to be saved and
distress relieved during the serial natural disaster that we face.

# Our OKH and OKW libraries

Our OKH and OKW libraries are implemented as publicly accessible Azure blob containers:

```
    "Azure_Storage_ServiceName": "https://projdatablobstorage.blob.core.windows.net",
    "Azure_Storage_OKH_ContainerName": "okh",
    "Azure_Storage_OKW_ContainerName": "okw"
```

These OKHs and OKWs are taken from our repo: [https://github.com/helpfulengineering/library](https://github.com/helpfulengineering/library).

Helpful created its own OKW template, and added an extenstion to OKH, both of which are defined here:
[https://github.com/helpfulengineering/OKF-Schema](https://github.com/helpfulengineering/OKF-Schema)

We are currently working with the Internet of Production Alliance (IoPA) to unify these extensions with their official schemas.

# Technology

At present, we are using Microsoft Azure to build a basic website.

Harry Pierson has explored an AI-based matching of tools and capabilities that are available to tools and capabilities
which are are needed to make needed articles.

The matching engine used for supply-graph flows lives in a separate repository, **[supply-graph-ai](https://github.com/helpfulengineering/supply-graph-ai)** (Open Hardware Manager, OHM): a FastAPI service that this Nuxt app calls from the browser.

# Volunteers Needed

We need volunteers. Although we can use a wide variety of skills we need:

1. Programmers who can build a website with Azure
2. Front-end programmers who, using Nuxt/Vue/Boostrap, can implement visual components.
   Apply here: https://helpful.directory/opportunity?id=Software-Developer---Typescript-446
3. AI programmers who can use vector-matching a LLMs to build a robust matching algorithm.

---

# Local development

This repository is a **monorepo of separate npm packages** (no root `package.json`). Install and start each part from its package directory.

| Component | Directory | Default URL | Purpose |
|-----------|-----------|-------------|---------|
| Azure Functions API | `packages/back-end` | `http://127.0.0.1:7071/api` | OKH/OKW listing, blob-backed product data, incidents (Postgres), etc. |
| Nuxt front end | `packages/front-end` | `http://localhost:3000` | Vue UI |
| Open Hardware Manager (supply-graph-ai) | *separate clone* (often **Docker Compose**) | `http://localhost:8001` | FastAPI matching / supply-tree API (`POST /v1/api/match`, docs at `/docs`) |
| Mock match API (optional) | `packages/mock-api` | `http://localhost:8001` | Tiny Express stub; **same port as OHM** — use one or the other, not both |

## Prerequisites

- **Node.js** (LTS recommended) and **npm**
- **Azure Functions Core Tools v4** (installed with `packages/back-end` via npm; ensure `func` is on your `PATH` after `npm install`)
- **Azure CLI** (`az`) — install from [Microsoft’s docs](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli). You need subscription access and permissions for team resources (blob storage, etc.) as appropriate.
- **PostgreSQL** — only if you use endpoints that query the database (e.g. `/api/incidents`). Configure via `packages/back-end/.env` (see [packages/back-end/README.md](packages/back-end/README.md)).
- **supply-graph-ai** — easiest path is **Docker Desktop** and **`docker compose`** in that repo (service **`ohm-api`** maps **host port 8001**). Alternative: local Python 3.12 / Conda per [supply-graph-ai README](https://github.com/helpfulengineering/supply-graph-ai/blob/main/README.md).

## 1. Back end (`packages/back-end`)

1. Copy **`local.settings.json.template`** to **`local.settings.json`** in `packages/back-end/`.

   The Functions host reads Azure storage settings from here. The app **fails at startup** if `Azure_Storage_ServiceName`, `Azure_Storage_OKH_ContainerName`, or `Azure_Storage_OKW_ContainerName` are missing.

2. If `func start` reports missing job storage, set **`AzureWebJobsStorage`** in `local.settings.json` to a valid value (for example an [Azurite](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-azurite) connection string for local development).

3. For database-backed routes, create **`packages/back-end/.env`** with `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, and optionally `PGPORT`.

4. From the repo root:

   ```bash
   cd packages/back-end
   npm install
   npm run start
   ```

   `npm run start` runs TypeScript build then `func start`. HTTP routes are served under **`/api/...`** (for example `http://localhost:7071/api/listOKHsummaries`).

5. **`az login`** — use the subscription and permissions your team expects for Azure resources (blob access, etc.).

## 2. Front end (`packages/front-end`)

```bash
cd packages/front-end
npm install
npm run dev
```

Open **http://localhost:3000** (and **http://localhost:3000/homepage** if you use that route).

### Pointing the UI at the APIs

The front end uses two different configuration mechanisms:

1. **`nuxt.config.ts` → `runtimeConfig.public.baseUrl`** — used by pages that call `useRuntimeConfig().public.baseUrl` (for example the home page). Default is **`http://127.0.0.1:7071/api`** (note **`127.0.0.1`**, not `localhost`; the project has seen browser/runtime quirks with `localhost` here).

   Override with **`BACKEND_URL`** when starting Nuxt, for example:

   ```bash
   BACKEND_URL=http://127.0.0.1:7071/api npm run dev
   ```

2. **`VITE_*` variables** — used by supply-graph-related pages (`supply-graph-api`, product supply tree). Set when starting Nuxt so they match your local Functions host and OHM:

   ```bash
   BACKEND_URL=http://127.0.0.1:7071/api \
   VITE_API_BASE_URL=http://127.0.0.1:7071/api \
   VITE_SUPPLY_GRAPH_AI_URL=http://localhost:8001 \
   npm run dev
   ```

   `nuxt.config.ts` also exposes **`SUPPLY_GRAPH_AI_URL`** as `runtimeConfig.public.supplyGraphAiUrl` for code that reads runtime config; the supply-graph pages above primarily use **`VITE_SUPPLY_GRAPH_AI_URL`**.

## 3. Open Hardware Manager — **supply-graph-ai** (matching API)

Clone [supply-graph-ai](https://github.com/helpfulengineering/supply-graph-ai) **outside** this repo (for example next to it: `../supply-graph-ai`).

### Docker Desktop (typical setup)

With **Docker Desktop** running, from the **supply-graph-ai** repository root:

```bash
cd /path/to/supply-graph-ai
cp env.template .env   # if you have not already; edit for storage/API keys as needed
docker compose up ohm-api
```

The Compose file publishes the FastAPI app on **host `localhost:8001`** (container service **`ohm-api`**, port mapping `8001:8001`). Confirm it is up:

- **http://localhost:8001/health**
- **http://localhost:8001/docs**

You can use `docker compose up` instead of `docker compose up ohm-api` if you intend to start the full stack defined in that repo’s `docker-compose.yml`.

### Local Python (no Docker)

For active development inside supply-graph-ai with hot reload:

```bash
cd /path/to/supply-graph-ai
conda create -n supply-graph-ai python=3.12
conda activate supply-graph-ai
pip install -r requirements.txt
pip install -e .
cp env.template .env
python run.py
```

Same default URL: **`http://localhost:8001`** (`API_PORT` in that project’s settings).

### Wiring project-data-platform-ts ↔ supply-graph-ai

| Direction | What to configure |
|-----------|-------------------|
| Browser → **Azure Functions** | `BACKEND_URL` / default `baseUrl` → `http://127.0.0.1:7071/api` (or your deployed API URL). |
| Browser → **OHM** | `VITE_SUPPLY_GRAPH_AI_URL` → base URL only, **no path** (e.g. `http://localhost:8001`). The front end appends **`/v1/api/match`** for match requests. |
| OKH file URL for match | Optional **`VITE_PUBLIC_OKH_BLOB_BASE`** (default: `https://projdatablobstorage.blob.core.windows.net/okh`). The UI sends **`okh_url`** = `{base}/{fname}` so OHM can fetch the manifest over HTTPS. |
| OHM → **Azure Blob** | Configure OHM’s `.env` / storage settings per [supply-graph-ai documentation](https://github.com/helpfulengineering/supply-graph-ai) so it can load OKW/OKH data as needed for matching. |
| **OKH vs OKW in a match call** | This repo sends **OKH** as **`okh_url`**. **OKW** (capability) files are **not** attached by the browser; OHM’s **`OKWService`** loads them from **OHM-configured storage** and matches against the fetched OKH. See **[docs/match-endpoint-integration.md](docs/match-endpoint-integration.md)** (section *OKH + OKW workflow*). |

**Match endpoint:** **`POST {VITE_SUPPLY_GRAPH_AI_URL}/v1/api/match`** — this is the route the Open Hardware Manager exposes; it is **not** the same as the stub in `packages/mock-api` (`POST /v1/match`).

**End-to-end match testing:** Follow **[docs/match-endpoint-integration.md](docs/match-endpoint-integration.md)** for the ordered verification steps (OHM health, blob URL reachability from Docker, Azure Functions, CORS, and curl). Shared client helpers live in **`packages/front-end/utils/ohmMatch.ts`**. To assert the **same JSON body and headers** as the UI against a running OHM, run **`OKH_FNAME=… node scripts/verify-ohm-match.mjs`** from the repo root (see doc §6).

**CORS:** In development, supply-graph-ai typically allows browser calls; if you change origins or run production-like settings, set **`CORS_ORIGINS`** in OHM’s environment so **`http://localhost:3000`** (and/or `http://127.0.0.1:3000`) is allowed.

**Ports:** Do not run **`packages/mock-api`** on port 8001 at the same time as OHM; they conflict. Use the mock only when you want a minimal stub instead of the real Python service.

## 4. Optional: mock API (`packages/mock-api`)

A minimal Express server for quick stubs. The code listens on **port 8001** and implements **`POST /v1/match`**, which is **not** the same path as OHM’s **`POST /v1/api/match`**. Use it only when you are **not** running supply-graph-ai on 8001.

```bash
cd packages/mock-api
npm install
npm run dev
```

---

# Older prototype website

The [older prototype website](https://helpfulengineering.github.io/project-data-platform-ts/) is implemented with Github Pages.

TypeScript port of original [Project Data Python Code](https://github.com/helpfulengineering/project-data-platform).
