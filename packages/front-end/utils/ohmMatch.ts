/**
 * Helpers for calling Open Hardware Manager (supply-graph-ai) POST /v1/api/match
 * from the browser. See docs/match-endpoint-integration.md.
 *
 * Workflow: we send OKH via okh_url; OHM fetches that manifest, loads OKWs from
 * its own storage (OKWService), applies optional filters, then matches and returns
 * data.solutions.
 */

const DEFAULT_OKH_BLOB_BASE = 'https://projdatablobstorage.blob.core.windows.net/okh';

export function getOhmBaseUrl(): string {
  const raw =
    import.meta.env.VITE_SUPPLY_GRAPH_AI_URL || 'http://localhost:8001';
  return raw.replace(/\/$/, '');
}

export function getPublicOkhBlobBase(): string {
  const raw = import.meta.env.VITE_PUBLIC_OKH_BLOB_BASE || DEFAULT_OKH_BLOB_BASE;
  return raw.replace(/\/$/, '');
}

/**
 * Manufacturing match: OHM fetches the manifest from this URL.
 * Use a publicly reachable URL (e.g. team Azure blob). If OHM runs in Docker,
 * http://localhost:7071/... will NOT reach your host — see integration doc.
 */
export function buildManufacturingMatchPayload(fname: string): { okh_url: string } {
  const base = getPublicOkhBlobBase();
  const name = (fname || '').replace(/^\/+/, '');
  if (!name) {
    throw new Error('Missing OKH file name (fname) for okh_url');
  }
  return { okh_url: `${base}/${name}` };
}

export const OHM_MATCH_PATH = '/v1/api/match';

export function getOhmMatchUrl(): string {
  return `${getOhmBaseUrl()}${OHM_MATCH_PATH}`;
}

export type ParsedOhmMatch = {
  solutions: Record<string, unknown>[];
  envelope: Record<string, unknown>;
};

/**
 * OHM wraps payloads in { status, message, data: { solutions, ... }, metadata }.
 */
export function parseOhmMatchBody(json: unknown): ParsedOhmMatch {
  if (!json || typeof json !== 'object') {
    return { solutions: [], envelope: {} };
  }
  const root = json as Record<string, unknown>;
  const data = root.data;
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>;
    if (Array.isArray(d.solutions)) {
      return {
        solutions: d.solutions as Record<string, unknown>[],
        envelope: root,
      };
    }
  }
  if (Array.isArray(root.solutions)) {
    return {
      solutions: root.solutions as Record<string, unknown>[],
      envelope: root,
    };
  }
  return { solutions: [], envelope: root };
}

export async function postOhmMatch(
  payload: Record<string, unknown>
): Promise<Response> {
  return fetch(getOhmMatchUrl(), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    body: JSON.stringify(payload),
  });
}
