"use client";

/**
 * Dashboard — list user's portfolios, with create / edit / delete actions.
 */

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import PortfolioCard from "@/components/PortfolioCard";
import { apiFetch } from "@/lib/api";
import { PORTFOLIO_ENDPOINTS, ROUTES } from "@/lib/constants";
import { showToast } from "@/components/Toast";
import styles from "./dashboard.module.css";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPortfolios = useCallback(async () => {
    try {
      const res = await apiFetch(PORTFOLIO_ENDPOINTS.MY);
      setPortfolios(res?.data?.portfolios ?? res?.data ?? []);
    } catch (err) {
      showToast(err.message || "Failed to load portfolios", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  const handleDelete = async (id) => {
    try {
      await apiFetch(PORTFOLIO_ENDPOINTS.BY_ID(id), { method: "DELETE" });
      setPortfolios((prev) => prev.filter((p) => p._id !== id));
      showToast("Portfolio deleted.", "success");
    } catch (err) {
      showToast(err.message || "Failed to delete portfolio", "error");
    }
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>My Portfolios</h1>
        <Link href={ROUTES.CREATE_PORTFOLIO} className={styles.createBtn}>
          + Create New Portfolio
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="page-loading">
          <div className="spinner" />
        </div>
      ) : portfolios.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📂</div>
          <h2 className={styles.emptyTitle}>No portfolios yet</h2>
          <p className={styles.emptyDesc}>
            Create your first portfolio and share it with the world.
          </p>
          <Link href={ROUTES.CREATE_PORTFOLIO} className={styles.createBtn}>
            + Create Portfolio
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {portfolios.map((p) => (
            <PortfolioCard key={p._id} portfolio={p} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
