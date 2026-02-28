"use client";

/**
 * AuthContext — provides authentication state & helpers to the entire app.
 *
 * Token strategy:
 *   • accessToken lives in React state (memory-only).
 *   • refreshToken lives in an httpOnly cookie managed by the backend.
 *   • On mount we call /api/auth/refresh to silently restore the session.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  apiFetch,
  setAccessToken,
  clearAccessToken,
  onTokenRefreshed,
} from "@/lib/api";
import { AUTH_ENDPOINTS, ROUTES } from "@/lib/constants";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while restoring session
  const [token, setToken] = useState(null);
  const router = useRouter();

  /* ---- Keep the api module in sync with context state ---- */
  useEffect(() => {
    onTokenRefreshed((newToken) => {
      setToken(newToken);
    });
  }, []);

  useEffect(() => {
    setAccessToken(token);
  }, [token]);

  /* ---- Restore session on first load ---- */
  useEffect(() => {
    restoreSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Attempt a silent refresh to restore the session after page reload. */
  const restoreSession = useCallback(async () => {
    try {
      const refreshRes = await apiFetch(
        AUTH_ENDPOINTS.REFRESH,
        { method: "POST" },
        false, // skip auto-retry on 401 — we ARE the refresh call
      );

      const newToken = refreshRes?.data?.accessToken;
      if (newToken) {
        setToken(newToken);
        setAccessToken(newToken);
        // Fetch user profile
        const meRes = await apiFetch(AUTH_ENDPOINTS.ME);
        setUser(meRes?.data?.user ?? meRes?.data ?? null);
      }
    } catch {
      // No valid session — clear everything silently
      setUser(null);
      setToken(null);
      clearAccessToken();
    } finally {
      setLoading(false);
    }
  }, []);

  /** Register a new account. */
  const register = useCallback(async (username, email, password) => {
    const res = await apiFetch(AUTH_ENDPOINTS.REGISTER, {
      method: "POST",
      body: { username, email, password },
    });

    const accessToken = res?.data?.accessToken;
    const userData = res?.data?.user;

    if (accessToken) {
      setToken(accessToken);
      setAccessToken(accessToken);
    }
    if (userData) setUser(userData);

    return res;
  }, []);

  /** Log in with email + password. */
  const login = useCallback(async (email, password) => {
    const res = await apiFetch(AUTH_ENDPOINTS.LOGIN, {
      method: "POST",
      body: { email, password },
    });

    const accessToken = res?.data?.accessToken;
    const userData = res?.data?.user;

    if (accessToken) {
      setToken(accessToken);
      setAccessToken(accessToken);
    }
    if (userData) setUser(userData);

    return res;
  }, []);

  /** Log out — clear tokens and redirect. */
  const logout = useCallback(async () => {
    try {
      await apiFetch(AUTH_ENDPOINTS.LOGOUT, { method: "POST" });
    } catch {
      // Even if the server call fails, clear local state
    }
    setUser(null);
    setToken(null);
    clearAccessToken();
    router.push(ROUTES.LOGIN);
  }, [router]);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Convenience hook to consume the auth context. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export default AuthContext;
