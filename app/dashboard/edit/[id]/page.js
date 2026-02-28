"use client";

/**
 * Edit Portfolio — fetch existing data, pre-fill form, and update on submit.
 */

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import PersonalPortfolioForm from "@/components/PersonalPortfolioForm";
import BusinessPortfolioForm from "@/components/BusinessPortfolioForm";
import { apiFetch } from "@/lib/api";
import { PORTFOLIO_ENDPOINTS, ROUTES } from "@/lib/constants";
import { showToast } from "@/components/Toast";
import editStyles from "../../create/create.module.css";

export default function EditPortfolioPage({ params }) {
  return (
    <ProtectedRoute>
      <EditContent params={params} />
    </ProtectedRoute>
  );
}

function EditContent({ params }) {
  const router = useRouter();
  // Next.js 15+ wraps params in a promise; unwrap with use() if needed
  const resolvedParams =
    typeof params?.then === "function" ? use(params) : params;
  const { id } = resolvedParams;

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;

    apiFetch(PORTFOLIO_ENDPOINTS.BY_ID(id))
      .then((res) => {
        setPortfolio(res?.data?.portfolio ?? res?.data ?? null);
      })
      .catch((err) => {
        showToast(err.message || "Failed to load portfolio", "error");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await apiFetch(PORTFOLIO_ENDPOINTS.BY_ID(id), {
        method: "PUT",
        body: formData,
      });

      showToast("Portfolio updated!", "success");
      router.push(ROUTES.DASHBOARD);
    } catch (err) {
      const fieldErrors = err.data?.errors;
      if (Array.isArray(fieldErrors) && fieldErrors.length) {
        const messages = fieldErrors.map((e) => e.message || e.msg).filter(Boolean);
        showToast(messages.join(" • ") || err.message, "error");
      } else {
        showToast(err.message || "Failed to update portfolio", "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className={editStyles.page}>
        <h1 className={editStyles.title}>Portfolio not found</h1>
        <p className={editStyles.subtitle}>
          The portfolio you&apos;re looking for doesn&apos;t exist or you
          don&apos;t have access.
        </p>
      </div>
    );
  }

  return (
    <div className={editStyles.page}>
      <div className={editStyles.header}>
        <h1 className={editStyles.title}>Edit Portfolio</h1>
        <p className={editStyles.subtitle}>
          Update your &quot;{portfolio.title}&quot; portfolio.
        </p>
      </div>

      {portfolio.category === "personal" ? (
        <PersonalPortfolioForm
          initialData={portfolio}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      ) : (
        <BusinessPortfolioForm
          initialData={portfolio}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      )}
    </div>
  );
}
