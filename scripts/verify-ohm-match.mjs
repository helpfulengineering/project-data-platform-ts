#!/usr/bin/env node
/**
 * Confirms the same POST /v1/api/match request shape the Nuxt app uses
 * (packages/front-end/utils/ohmMatch.ts) returns HTTP 200 from OHM.
 * Body is okh_url only; OHM loads OKWs from its storage service server-side.
 *
 * Usage:
 *   OKH_FNAME=some-okh.yml node scripts/verify-ohm-match.mjs
 *   OKH_URL='https://.../okh/file.yml' node scripts/verify-ohm-match.mjs
 *
 * Env (optional, matches Vite):
 *   VITE_SUPPLY_GRAPH_AI_URL  default http://localhost:8001
 *   VITE_PUBLIC_OKH_BLOB_BASE default https://projdatablobstorage.blob.core.windows.net/okh
 */

const OHM_BASE = (
  process.env.VITE_SUPPLY_GRAPH_AI_URL ||
  process.env.OHM_BASE ||
  'http://localhost:8001'
).replace(/\/$/, '');

const BLOB_BASE = (
  process.env.VITE_PUBLIC_OKH_BLOB_BASE ||
  'https://projdatablobstorage.blob.core.windows.net/okh'
).replace(/\/$/, '');

const fname = process.env.OKH_FNAME?.trim();
const okhUrl =
  process.env.OKH_URL?.trim() ||
  (fname ? `${BLOB_BASE}/${fname.replace(/^\/+/, '')}` : null);

if (!okhUrl) {
  console.error(
    'Missing OKH target. Set OKH_URL (full manifest URL) or OKH_FNAME (file name under blob base).'
  );
  process.exit(2);
}

const matchUrl = `${OHM_BASE}/v1/api/match`;
const payload = { okh_url: okhUrl };

const res = await fetch(matchUrl, {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload),
});

const text = await res.text();
let json;
try {
  json = JSON.parse(text);
} catch {
  json = null;
}

console.log('Request URL:', matchUrl);
console.log('Request body:', JSON.stringify(payload));
console.log('HTTP', res.status, res.statusText);

if (!res.ok) {
  console.error('Response (truncated):', text.slice(0, 1200));
  process.exit(1);
}

const solutionsLen = json?.data?.solutions?.length;
const total = json?.data?.total_solutions;
const apiStatus = json?.status;

console.log('Response envelope:', {
  status: apiStatus,
  message: json?.message,
  total_solutions: total,
  solutions_length: solutionsLen,
});

if (apiStatus !== 'success') {
  console.warn(
    'Warning: HTTP 200 but JSON status is not "success"; check OHM response shape.'
  );
  process.exit(1);
}

console.log('OK: match request matches front-end contract and returned HTTP 200.');
process.exit(0);
