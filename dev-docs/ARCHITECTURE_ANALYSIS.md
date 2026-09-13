# Architecture Analysis & Containerization Roadmap

## Executive Summary

This document provides a comprehensive analysis of the Project Data Platform codebase, mapping all front-end and back-end functions, identifying issues, and outlining the path to containerization for Azure serverless deployment.

---

## Current Architecture Overview

### Technology Stack

**Front-End:**
- **Framework:** Nuxt 3 (Vue 3)
- **Styling:** Tailwind CSS
- **Build Tool:** Nuxt (Vite-based)
- **Port:** 3000 (development)

**Back-End:**
- **Runtime:** Azure Functions v4 (Node.js)
- **Language:** TypeScript
- **Port:** 7071 (local development)
- **Database:** PostgreSQL (via `pg` library)
- **Storage:** Azure Blob Storage

**External Services:**
- Azure Blob Storage (OKH/OKW libraries)
- PostgreSQL Database (incidents, project data)
- Supply Graph AI Service (port 8081/8001 - external dependency)

---

## Back-End API Functions Map

### Location: `packages/back-end/src/functions/httpFunctions.ts`

| Function Name | Route Pattern | Methods | Purpose | Status |
|--------------|---------------|---------|---------|--------|
| `test` | `/test` | GET, POST | Health check endpoint | ✅ Active |
| `listRoutes` | `/listRoutes` | GET, POST | Lists all available API routes | ✅ Active |
| `getFile` | `/getFile/{containerName}/{fileName}/{fileType}` | GET, POST | Downloads blob file (JSON/YAML) from Azure Storage | ✅ Active |
| `listFilesByContainerName` | `/listFiles/{containerName}` | GET, POST | Lists all files in specified container (okh/okw) | ✅ Active |
| `listOKHsummaries` | `/listOKHsummaries` | GET, POST | Returns summary thumbnails for OKH products | ✅ Active |
| `listOKWsummaries` | `/listOKWsummaries` | GET, POST | Returns summary thumbnails for OKW products | ✅ Active |
| `getRelatedOKH` | `/getRelatedOKH` | GET, POST | Returns OKH products matching keywords | ✅ Active |
| `getIncidents` | `/incidents` | GET, POST | Returns all incidents from PostgreSQL database | ✅ Active |

### Helper Functions (Internal)

- `getOKHByFileName()` - Fetches OKH/OKW file from Azure Blob Storage with caching
- `convertToProduct()` - Transforms OKH/OKW data to product summary format
- `hasOverlapKeywords()` - Keyword matching logic
- `normalizeKeywords()` - Keyword normalization utility
- `listSummaries()` - Shared logic for OKH/OKW summary generation

### Back-End Dependencies

**Core:**
- `@azure/functions` - Azure Functions runtime
- `@azure/storage-blob` - Azure Blob Storage client
- `@azure/identity` - Azure authentication
- `pg` - PostgreSQL client
- `yaml` - YAML parsing
- `lodash` - Utility functions
- `dotenv` - Environment variable management

**Configuration Files:**
- `host.json` - Azure Functions host configuration
- `local.settings.json` - Local development settings (not in git)
- `local.settings.json.template` - Template for local settings

---

## Front-End Pages & Components Map

### Pages (`packages/front-end/pages/`)

| Page | Route | Purpose | API Calls |
|------|-------|---------|-----------|
| `index.vue` | `/` | Homepage - displays OKH product summaries | `GET /listOKHsummaries` |
| `homepage.vue` | `/homepage` | Incident display page (hardcoded data) | None (static) |
| `products/[id]/index.vue` | `/products/:id` | Product detail page | `GET /getFile/okh/{name}/{ext}` |
| `products/[id]/supplyTree.vue` | `/products/:id/supplyTree` | Supply tree visualization | External: Supply Graph AI API |
| `detailedcrisis.vue` | `/detailedcrisis` | Detailed crisis/incident view | `GET /incidents` |
| `about.vue` | `/about` | About page | None |
| `contact.vue` | `/contact` | Contact page | None |
| `login.vue` | `/login` | Login page (UI only) | None |
| `register.vue` | `/register` | Registration page (UI only) | None |
| `supply-graph-api.vue` | `/supply-graph-api` | Supply graph API testing page | `GET /listOKHsummaries`, External: Supply Graph AI |

### Components (`packages/front-end/components/`)

| Component | Purpose | API Calls |
|-----------|---------|-----------|
| `AppHeader.vue` | Navigation header | None |
| `ProductCard.vue` | Product card display | None |
| `ProductGroup.vue` | Product group container | None |
| `RelatedItems.vue` | Related products display | `GET /getRelatedOKH?keywords=...` |
| `IncidentsCard.vue` | Incident card display | None |
| `Slider.vue` | Image slider | None |
| `D3Tree.vue` | D3.js tree visualization | None |
| `Reviews.vue` | Reviews display | None |
| `SkeletonCard.vue` | Loading skeleton | None |
| `SkeletonRelatedItems.vue` | Loading skeleton | None |

### Front-End Configuration

**Key Files:**
- `nuxt.config.ts` - Nuxt configuration with hardcoded backend URL
- `package.json` - Dependencies and scripts
- `tailwind.config.js` - Tailwind CSS configuration

**Runtime Configuration:**
- `baseUrl`: `http://127.0.0.1:7071/api` (hardcoded, can be overridden with `BACKEND_URL` env var)
- `supplyGraphAiUrl`: `http://localhost:8081` (can be overridden with `SUPPLY_GRAPH_AI_URL` env var)

---

## Data Flow Architecture

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │
         │ HTTP Requests
         ▼
┌─────────────────────────────────┐
│   Nuxt Front-End (Port 3000)   │
│   - SSR/SSG                     │
│   - Vue Components              │
│   - Tailwind CSS                │
└────────┬────────────────────────┘
         │
         │ API Calls (useFetch)
         ▼
┌─────────────────────────────────┐
│ Azure Functions (Port 7071)    │
│ - HTTP Triggers                 │
│ - TypeScript                    │
└────────┬────────────────────────┘
         │
         ├─────────────────┬──────────────────┐
         │                 │                  │
         ▼                 ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Azure Blob   │  │ PostgreSQL   │  │ Supply Graph │
│ Storage      │  │ Database     │  │ AI Service   │
│ (OKH/OKW)    │  │ (Incidents)  │  │ (External)   │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## Critical Issues & Technical Debt

### 🔴 High Priority Issues

1. **Hardcoded URLs**
   - `nuxt.config.ts` has hardcoded `http://127.0.0.1:7071/api`
   - Backend URL should be environment-based for production
   - CORS configuration is permissive (`*`) in development

2. **Environment Variable Management**
   - Backend uses `dotenv` with path `../.env` (parent directory)
   - No clear `.env` file structure
   - Database credentials in environment variables (not in `local.settings.json`)
   - Azure Storage credentials in `local.settings.json` but should use Azure Key Vault in production

3. **Database Connection**
   - PostgreSQL connection uses environment variables (`PGHOST`, `PGUSER`, etc.)
   - SSL configuration with `rejectUnauthorized: false` (security risk)
   - No connection pooling configuration visible
   - No error handling for database connection failures

4. **Caching Implementation**
   - In-memory cache in `getOKHByFileName()` (line 282-323)
   - Comment says "temporary implementation" - needs proper cache strategy
   - Cache never expires, could cause memory issues

5. **Error Handling**
   - Inconsistent error responses across endpoints
   - Some endpoints return error objects, others return error messages
   - No structured error logging

6. **Code Quality Issues**
   - Duplicate code in `listFilesByContainerName()` (lines 105-110, 113-116)
   - Commented-out code in `httpFunctions.ts` (lines 44-46)
   - Inconsistent CORS headers across endpoints
   - Console.log statements in production code

### 🟡 Medium Priority Issues

7. **Type Safety**
   - Heavy use of `any` types
   - Missing type definitions for OKH/OKW structures
   - No shared types between front-end and back-end

8. **Security Concerns**
   - CORS allows all origins (`*`)
   - No authentication/authorization implemented
   - Database credentials in environment variables (should use managed identity)

9. **Build Configuration**
   - No production build optimization visible
   - No Dockerfile or containerization setup
   - No CI/CD pipeline configuration

10. **Dependencies**
    - Some dependencies may be outdated
    - No lock files visible (package-lock.json in .gitignore)
    - Potential security vulnerabilities

### 🟢 Low Priority / Cleanup

11. **Documentation**
    - Missing API documentation
    - No OpenAPI/Swagger specification
    - README has outdated information

12. **Code Organization**
    - Utility functions duplicated between front-end and back-end
    - No clear separation of concerns in some components
    - Mixed concerns in some files

---

## Containerization Requirements

### For Azure Serverless Deployment

#### Back-End (Azure Functions)

**Requirements:**
1. **Dockerfile** for Azure Functions
   - Base image: `mcr.microsoft.com/azure-functions/node:4-node20` or similar
   - Install dependencies
   - Copy source files
   - Build TypeScript
   - Set entry point

2. **Environment Configuration**
   - Move all secrets to Azure Key Vault or App Settings
   - Remove hardcoded values
   - Use managed identity for Azure Storage
   - Use connection strings for PostgreSQL

3. **Build Process**
   - TypeScript compilation
   - Dependency installation
   - Output to `dist/` directory

4. **Azure Functions Configuration**
   - Update `host.json` for production
   - Configure CORS properly
   - Set up Application Insights
   - Configure scaling options

#### Front-End (Nuxt)

**Options for Deployment:**

**Option A: Static Site Generation (SSG)**
- Build static site with `nuxt generate`
- Deploy to Azure Static Web Apps or Blob Storage + CDN
- Requires API calls to be client-side only

**Option B: Server-Side Rendering (SSR)**
- Containerize Nuxt with Node.js
- Deploy to Azure Container Apps or App Service
- Requires server runtime

**Option C: Hybrid (Recommended)**
- Static generation for most pages
- API routes for dynamic content
- Deploy static assets to CDN
- API to Azure Functions

**Requirements:**
1. **Dockerfile** for Nuxt
   - Base image: `node:20-alpine`
   - Multi-stage build (build + production)
   - Install dependencies
   - Build Nuxt app
   - Serve with Node.js or static files

2. **Environment Configuration**
   - Runtime config for backend URL
   - Environment-based API endpoints
   - Remove hardcoded URLs

3. **Build Configuration**
   - Production build optimizations
   - Environment variable injection
   - Asset optimization

---

## Containerization Roadmap

### Phase 1: Code Cleanup & Preparation

1. ✅ **Remove hardcoded URLs**
   - Update `nuxt.config.ts` to use environment variables
   - Ensure all API calls use runtime config

2. ✅ **Fix environment variable management**
   - Standardize `.env` file structure
   - Document required environment variables
   - Create `.env.example` files

3. ✅ **Improve error handling**
   - Standardize error responses
   - Add proper logging
   - Remove console.log statements

4. ✅ **Fix code quality issues**
   - Remove duplicate code
   - Remove commented-out code
   - Fix CORS configuration

5. ✅ **Update database configuration**
   - Proper SSL configuration
   - Connection pooling
   - Error handling

### Phase 2: Docker Setup

1. **Back-End Dockerfile**
   - Create Dockerfile for Azure Functions
   - Multi-stage build
   - Optimize image size

2. **Front-End Dockerfile**
   - Create Dockerfile for Nuxt
   - Choose SSG or SSR approach
   - Optimize build

3. **Docker Compose (Optional)**
   - Local development setup
   - Include PostgreSQL if needed locally

### Phase 3: Azure Configuration

1. **Azure Functions Setup**
   - Create Function App
   - Configure Application Settings
   - Set up Key Vault integration
   - Configure CORS

2. **Front-End Deployment**
   - Choose deployment target (Static Web Apps / Container Apps / App Service)
   - Configure custom domain
   - Set up CDN if needed

3. **Database Setup**
   - Azure Database for PostgreSQL
   - Configure firewall rules
   - Set up connection string

4. **Storage Setup**
   - Verify Azure Blob Storage access
   - Configure managed identity
   - Test blob access

### Phase 4: Testing & Optimization

1. **Integration Testing**
   - Test all API endpoints
   - Verify front-end to back-end communication
   - Test with production-like environment

2. **Performance Optimization**
   - Implement proper caching strategy
   - Optimize database queries
   - Optimize bundle sizes

3. **Security Hardening**
   - Implement proper CORS
   - Add authentication if needed
   - Security scanning

---

## Environment Variables Reference

### Back-End Required Variables

```bash
# Azure Storage
Azure_Storage_ServiceName=https://projectdatablobstorage.blob.core.windows.net
Azure_Storage_OKH_ContainerName=okh
Azure_Storage_OKW_ContainerName=okw

# PostgreSQL Database
PGHOST=<database-host>
PGUSER=<database-user>
PGPASSWORD=<database-password>
PGDATABASE=<database-name>
PGPORT=5432

# Azure Functions
AzureWebJobsStorage=<storage-connection-string>
FUNCTIONS_WORKER_RUNTIME=node
```

### Front-End Required Variables

```bash
# Backend API URL
BACKEND_URL=http://localhost:7071/api  # Development
# BACKEND_URL=https://<function-app>.azurewebsites.net/api  # Production

# Supply Graph AI (Optional)
SUPPLY_GRAPH_AI_URL=http://localhost:8081
```

---

## Next Steps

1. **Review this document** and prioritize issues
2. **Start with Phase 1** - Code cleanup
3. **Create Dockerfiles** for both front-end and back-end
4. **Test locally** with Docker
5. **Deploy to Azure** and test
6. **Iterate** based on findings

---

## Questions to Resolve

1. **Deployment Target:** Static Web Apps, Container Apps, or App Service for front-end?
2. **Authentication:** Do we need user authentication? If so, which provider?
3. **Database:** Is PostgreSQL already set up in Azure, or do we need to create it?
4. **Supply Graph AI:** Is this a separate service that needs to be containerized too?
5. **Domain:** Do we have a custom domain for production?
6. **CI/CD:** Do we need to set up GitHub Actions or Azure DevOps pipelines?

---

*Document created: 2024*
*Last updated: 2024*
