# Containerization Checklist

Quick reference checklist for preparing the Project Data Platform for Azure serverless deployment.

## Pre-Containerization Tasks

### Code Cleanup
- [ ] Remove hardcoded URLs from `nuxt.config.ts`
- [ ] Standardize environment variable usage
- [ ] Remove duplicate code in `listFilesByContainerName()`
- [ ] Remove commented-out code
- [ ] Replace console.log with proper logging
- [ ] Fix CORS configuration (remove wildcard `*`)
- [ ] Implement proper error handling
- [ ] Remove or improve temporary cache implementation
- [ ] Fix database SSL configuration

### Environment Configuration
- [ ] Create `.env.example` for back-end
- [ ] Create `.env.example` for front-end
- [ ] Document all required environment variables
- [ ] Verify environment variable loading works correctly
- [ ] Test with different environment configurations

### Type Safety
- [ ] Create shared type definitions for OKH/OKW
- [ ] Replace `any` types with proper types
- [ ] Add type definitions for API responses

## Docker Setup

### Back-End Dockerfile
- [ ] Create `packages/back-end/Dockerfile`
- [ ] Use Azure Functions base image
- [ ] Configure multi-stage build
- [ ] Set up TypeScript compilation
- [ ] Configure entry point
- [ ] Test Docker build locally
- [ ] Verify function endpoints work in container

### Front-End Dockerfile
- [ ] Decide on deployment strategy (SSG vs SSR)
- [ ] Create `packages/front-end/Dockerfile`
- [ ] Configure build process
- [ ] Set up environment variable injection
- [ ] Test Docker build locally
- [ ] Verify front-end works in container

### Docker Compose (Optional)
- [ ] Create `docker-compose.yml` for local development
- [ ] Include front-end service
- [ ] Include back-end service
- [ ] Include PostgreSQL (if needed locally)
- [ ] Test full stack locally

## Azure Configuration

### Azure Functions
- [ ] Create Function App in Azure Portal
- [ ] Configure Application Settings
- [ ] Set up Azure Key Vault integration
- [ ] Configure CORS for production domain
- [ ] Set up Application Insights
- [ ] Configure scaling options
- [ ] Test deployment
- [ ] Verify all endpoints work

### Front-End Deployment
- [ ] Choose deployment target:
  - [ ] Azure Static Web Apps (SSG)
  - [ ] Azure Container Apps (SSR)
  - [ ] Azure App Service (SSR)
- [ ] Configure custom domain (if applicable)
- [ ] Set up CDN (if using Static Web Apps)
- [ ] Configure environment variables
- [ ] Test deployment
- [ ] Verify API connectivity

### Database
- [ ] Verify PostgreSQL database exists in Azure
- [ ] Configure firewall rules
- [ ] Set up connection string
- [ ] Test database connectivity
- [ ] Verify schema exists (`project_data.incident`)

### Storage
- [ ] Verify Azure Blob Storage access
- [ ] Configure managed identity (if using)
- [ ] Test blob access from Functions
- [ ] Verify OKH/OKW containers are accessible

## Testing

### Local Testing
- [ ] Test back-end in Docker
- [ ] Test front-end in Docker
- [ ] Test full stack with Docker Compose
- [ ] Verify all API endpoints
- [ ] Test error scenarios
- [ ] Verify CORS works correctly

### Azure Testing
- [ ] Deploy back-end to Azure
- [ ] Deploy front-end to Azure
- [ ] Test all endpoints in production
- [ ] Verify database connectivity
- [ ] Verify blob storage access
- [ ] Test error handling
- [ ] Performance testing
- [ ] Load testing (if applicable)

## Security

- [ ] Remove hardcoded credentials
- [ ] Use Azure Key Vault for secrets
- [ ] Configure proper CORS (not wildcard)
- [ ] Implement proper SSL/TLS
- [ ] Security scanning of dependencies
- [ ] Review and fix security vulnerabilities
- [ ] Set up authentication (if needed)

## Documentation

- [ ] Update README with deployment instructions
- [ ] Document environment variables
- [ ] Create deployment guide
- [ ] Document API endpoints
- [ ] Update architecture documentation

## Monitoring & Logging

- [ ] Set up Application Insights
- [ ] Configure logging
- [ ] Set up alerts
- [ ] Configure monitoring dashboards

---

## Quick Reference: Key Files to Modify

### Back-End
- `packages/back-end/src/functions/httpFunctions.ts` - API endpoints
- `packages/back-end/src/db.ts` - Database configuration
- `packages/back-end/src/lib/azure-storage.ts` - Storage access
- `packages/back-end/local.settings.json` - Local config
- `packages/back-end/host.json` - Functions host config

### Front-End
- `packages/front-end/nuxt.config.ts` - Nuxt configuration
- `packages/front-end/pages/**/*.vue` - Pages using API
- `packages/front-end/components/**/*.vue` - Components using API

---

## Environment Variables Quick Reference

### Back-End
```bash
Azure_Storage_ServiceName
Azure_Storage_OKH_ContainerName
Azure_Storage_OKW_ContainerName
PGHOST
PGUSER
PGPASSWORD
PGDATABASE
PGPORT
AzureWebJobsStorage
FUNCTIONS_WORKER_RUNTIME=node
```

### Front-End
```bash
BACKEND_URL
SUPPLY_GRAPH_AI_URL (optional)
```

---

*Use this checklist alongside ARCHITECTURE_ANALYSIS.md for complete containerization planning.*
