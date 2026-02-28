/**
 * Public Portfolio View (/p/[slug])
 * Server component that fetches portfolio data by slug.
 * Uses generateMetadata for SEO.
 */

import { API_BASE_URL, PORTFOLIO_ENDPOINTS } from "@/lib/constants";
import PortfolioView from "./PortfolioView";

/**
 * Generate dynamic metadata for SEO.
 */
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  try {
    const res = await fetch(
      `${API_BASE_URL}${PORTFOLIO_ENDPOINTS.BY_SLUG(slug)}`,
      { cache: "no-store" },
    );

    if (!res.ok) return { title: "Portfolio Not Found" };

    const json = await res.json();
    const portfolio = json?.data?.portfolio ?? json?.data;

    return {
      title: portfolio?.title
        ? `${portfolio.title} — OpenPersona`
        : "OpenPersona Portfolio",
      description:
        portfolio?.subtitle ||
        portfolio?.headline ||
        portfolio?.tagline ||
        "A portfolio built with OpenPersona.",
    };
  } catch {
    return { title: "OpenPersona Portfolio" };
  }
}

/**
 * Server component — fetches portfolio and passes to the client view.
 */
export default async function PublicPortfolioPage({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  let portfolio = null;
  let error = null;

  try {
    const res = await fetch(
      `${API_BASE_URL}${PORTFOLIO_ENDPOINTS.BY_SLUG(slug)}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      error = "Portfolio not found.";
    } else {
      const json = await res.json();
      portfolio = json?.data?.portfolio ?? json?.data ?? null;
    }
  } catch {
    error = "Failed to load portfolio.";
  }

  return <PortfolioView portfolio={portfolio} error={error} />;
}
