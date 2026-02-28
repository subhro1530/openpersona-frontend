"use client";

/**
 * Edit portfolio page.
 *
 * BUG FIXES:
 *  1. Fetches via GET_BY_ID (GET /api/portfolio/id/:id) — not the slug route.
 *  2. Flattens `portfolio.data` into initialData so form fields are populated.
 *  3. Uses BY_ID(id) for the PUT update call.
 */

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import PersonalPortfolioForm from "@/components/PersonalPortfolioForm";
import BusinessPortfolioForm from "@/components/BusinessPortfolioForm";
import { apiFetch } from "@/lib/api";
import { PORTFOLIO_ENDPOINTS, ROUTES } from "@/lib/constants";
import { showToast } from "@/components/Toast";
import styles from "../../dashboard.module.css";

function EditContent({ id }) {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // FIX: use GET_BY_ID  →  GET /api/portfolio/id/:id
        const res = await apiFetch(PORTFOLIO_ENDPOINTS.GET_BY_ID(id));
        const p = res?.data?.portfolio ?? res?.data ?? res?.portfolio ?? res;
        setPortfolio(p);
      } catch {
        showToast("Failed to load portfolio", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      await apiFetch(PORTFOLIO_ENDPOINTS.BY_ID(id), {
        method: "PUT",
        body: formData,
      });
      showToast("Portfolio updated!", "success");
      router.push(ROUTES.DASHBOARD);
    } catch (err) {
      showToast(err.message || "Update failed", "error");
      throw err; // let form handle field errors
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loader}>
        <div className="spinner" />
        <p>Loading portfolio…</p>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className={styles.empty}>
        <h2 className={styles.emptyTitle}>Portfolio not found</h2>
        <Link href={ROUTES.DASHBOARD} className={styles.createBtn}>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // FIX: Flatten portfolio.data into form‑ready initialData
  const initialData = {
    title: portfolio.title || "",
    subtitle: portfolio.subtitle || "",
    slug: portfolio.slug || "",
    theme_id: portfolio.theme_id || "",
    ...(portfolio.data || {}),
  };

  const FormComponent =
    portfolio.category === "personal"
      ? PersonalPortfolioForm
      : BusinessPortfolioForm;

  return (
    <div className={styles.page}>
      <div className={styles.welcome}>
        <div className={styles.welcomeInner}>
          <div>
            <h1 className={styles.welcomeTitle}>Edit Portfolio</h1>
            <p className={styles.welcomeSub}>
              Update your {portfolio.category} portfolio
            </p>
          </div>
          <Link href={ROUTES.DASHBOARD} className={styles.createBtn}>
            ← Back
          </Link>
        </div>
      </div>

      <FormComponent
        initialData={initialData}
        onSubmit={handleSubmit}
        submitting={saving}
      />
    </div>
  );
}

export default function EditPage({ params }) {
  const { id } = use(params);

  return (
    <ProtectedRoute>
      <EditContent id={id} />
    </ProtectedRoute>
  );
}
