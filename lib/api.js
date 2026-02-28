/**
 * Centralized fetch wrapper for the OpenPersona API.
 *
 * - Always sends credentials: 'include' so httpOnly cookies travel with requests.
 * - Attaches the Authorization header when an accessToken is provided.
 * - On a 401 response, automatically attempts a token refresh and retries once.
 */

import { API_BASE_URL, AUTH_ENDPOINTS } from "./constants";

/* ------------------------------------------------------------------ */
/*  Token management helpers (in-memory only — never localStorage)    */
/* ------------------------------------------------------------------ */

let _accessToken = null;
let _onTokenRefreshed = null; // callback set by AuthContext

/** Store a new access token in memory. */
export function setAccessToken(token) {
  _accessToken = token;
}

/** Retrieve the current in-memory access token. */
export function getAccessToken() {
  return _accessToken;
}

/** Clear the in-memory access token (used on logout). */
export function clearAccessToken() {
  _accessToken = null;
}

/**
 * Register a callback that will be invoked with a new accessToken
 * whenever the wrapper successfully refreshes the token.
 */
export function onTokenRefreshed(cb) {
  _onTokenRefreshed = cb;
}

/* ------------------------------------------------------------------ */
/*  Internal: token refresh                                           */
/* ------------------------------------------------------------------ */

let _refreshPromise = null;

async function refreshAccessToken() {
  // Deduplicate concurrent refresh calls
  if (_refreshPromise) return _refreshPromise;

  _refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.REFRESH}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        clearAccessToken();
        return null;
      }

      const json = await res.json();
      const newToken = json?.data?.accessToken ?? null;

      if (newToken) {
        setAccessToken(newToken);
        if (_onTokenRefreshed) _onTokenRefreshed(newToken);
      }

      return newToken;
    } catch {
      clearAccessToken();
      return null;
    } finally {
      _refreshPromise = null;
    }
  })();

  return _refreshPromise;
}

/* ------------------------------------------------------------------ */
/*  Public: apiFetch                                                  */
/* ------------------------------------------------------------------ */

/**
 * Wrapper around the native fetch API tailored for the OpenPersona backend.
 *
 * @param {string}  endpoint  - API path (e.g. '/api/portfolio/my')
 * @param {object}  [options] - Standard fetch options (method, body, headers …)
 * @param {boolean} [retry]   - Internal flag to prevent infinite retry loops.
 * @returns {Promise<object>}   Parsed JSON response.
 */
export async function apiFetch(endpoint, options = {}, retry = true) {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (_accessToken) {
    headers["Authorization"] = `Bearer ${_accessToken}`;
  }

  const config = {
    ...options,
    headers,
    credentials: "include",
  };

  // Stringify body if it's an object
  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body);
  }

  let res;
  try {
    res = await fetch(url, config);
  } catch (err) {
    throw new Error("Network error — please check your connection.");
  }

  // On 401 → attempt silent refresh & retry once
  if (res.status === 401 && retry) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return apiFetch(endpoint, options, false);
    }
    // Refresh failed — surface the 401
  }

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      json?.message || json?.error || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = json;
    throw err;
  }

  return json;
}
