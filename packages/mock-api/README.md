# Mock API (project-data-platform-ts)

Lightweight Express mock API used for local development and for testing integration with the frontend and supply-graph services.

- Port: 8081 (default)
- Purpose: return deterministic mock supply-tree responses and basic health checks.

## Quick start

1. Install dependencies

```powershell
npm install
```

2. Start dev server

```powershell
npm run dev
```

3. Server will be listening on:

```
http://localhost:8081
```

(If you want to run without nodemon, use `node index.js`.)

## Available endpoints

- GET /  
  - Basic welcome text.

- POST /v1/match  
  - Accepts a JSON body and returns a mock supply-tree response.
  - Useful for testing supply-graph AI integration.

- GET /health  
  - Returns a simple health JSON: `{ "status": "OK", "message": "Server is healthy!" }`.

## Example cURL

POST to the match endpoint:

```bash
curl -X POST http://localhost:8081/v1/match \
  -H "Content-Type: application/json" \
  -d '{"product": {"id":"Q15026","desc":"chair"}}'
```

Response will be the mock supply-tree JSON defined in `mock-data.js`.

## Files

- `index.js` — Express server and endpoints.
- `mock-data.js` — Contains the mock response object(s) including `supplyTreeMockResponse`.
- `package.json` — Scripts and dependencies.

## Notes

- This mock API is intentionally simple and synchronous to make frontend integration straightforward.
- Replace or extend the mock response in `mock-data.js` to suit tests or demos.
- The repo uses `type: "module"`, so Node should be v14+ (prefer v18+).

## License

Project license follows the parent repository. See top-level LICENSE for details.
