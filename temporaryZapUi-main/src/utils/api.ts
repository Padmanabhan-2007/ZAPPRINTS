/**
 * Resolves the authoritative backend API base URL for ZapPrints.
 * 
 * Production Security Rules (H-02):
 * - Must use HTTPS or same-origin /api.
 * - Never falls back to cleartext http:// or localhost in production.
 * - If VITE_API_URL is configured in production, it must use HTTPS or root-relative /api.
 * - Fails safely if an insecure (http://) API URL is provided in production.
 * 
 * Development Behavior:
 * - Uses VITE_API_URL if configured.
 * - Otherwise uses same-origin /api, which the Vite dev/preview server proxies to the backend
 *   on localhost:3001. This means a phone on the LAN only needs to reach the frontend port;
 *   it never has to open a second port (3001) on the dev machine, which a firewall would
 *   silently drop and leave requests hanging for minutes.
 */
export const resolveApiUrl = (
  envUrl?: string,
  isProd: boolean = import.meta.env.PROD,
  hostname?: string
): string => {
  const trimmedEnv = envUrl?.trim();

  if (trimmedEnv) {
    let cleanUrl = trimmedEnv.replace(/\/$/, '');
    if (isProd) {
      if (cleanUrl.startsWith('https://') || cleanUrl.startsWith('/')) {
        if (!cleanUrl.endsWith('/api')) {
          cleanUrl = `${cleanUrl}/api`;
        }
        return cleanUrl;
      }
      console.error('[SECURITY ERROR] Insecure VITE_API_URL configured for production:', trimmedEnv);
      throw new Error('Insecure API URL: Production builds must use HTTPS or root-relative /api');
    }
    if (!cleanUrl.endsWith('/api')) {
      cleanUrl = `${cleanUrl}/api`;
    }
    return cleanUrl;
  }

  if (isProd) {
    // In production without an explicit VITE_API_URL, use same-origin /api
    return '/api';
  }

  // Development fallback: same-origin /api, proxied by Vite to the backend (see vite.config.ts)
  void hostname;
  return '/api';
};

export const getApiUrl = (): string => {
  return resolveApiUrl(import.meta.env.VITE_API_URL as string | undefined, import.meta.env.PROD);
};

export const API_URL = getApiUrl();

/**
 * fetch() with a hard timeout. The browser's own connect timeout can be minutes on a phone
 * when the server is unreachable, which would leave the UI waiting on a request that
 * is never going to answer.
 */
export const fetchWithTimeout = (
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = 6000
): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(input, { ...init, signal: controller.signal }).finally(() => clearTimeout(timer));
};
