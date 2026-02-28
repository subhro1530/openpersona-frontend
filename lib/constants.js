/**
 * Application-wide constants for OpenPersona.
 */

/** Base URL of the backend API server */
export const API_BASE_URL = "http://localhost:5000";

/** Auth endpoints */
export const AUTH_ENDPOINTS = {
  REGISTER: "/api/auth/register",
  LOGIN: "/api/auth/login",
  LOGOUT: "/api/auth/logout",
  ME: "/api/auth/me",
  REFRESH: "/api/auth/refresh",
};

/** Portfolio endpoints */
export const PORTFOLIO_ENDPOINTS = {
  CREATE: "/api/portfolio/create",
  MY: "/api/portfolio/my",
  BY_SLUG: (slug) => `/api/portfolio/${slug}`,
  BY_ID: (id) => `/api/portfolio/${id}`,
};

/** Theme endpoints */
export const THEME_ENDPOINTS = {
  BY_CATEGORY: (category) => `/api/themes/${category}`,
};

/** Portfolio categories */
export const CATEGORIES = {
  PERSONAL: "personal",
  BUSINESS: "business",
};

/** Application routes */
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  CREATE_PORTFOLIO: "/dashboard/create",
  EDIT_PORTFOLIO: (id) => `/dashboard/edit/${id}`,
  PUBLIC_PORTFOLIO: (slug) => `/p/${slug}`,
};

/** Toast notification durations (ms) */
export const TOAST_DURATION = 4000;
