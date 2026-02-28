"use client";

/**
 * Dashboard — lists all user portfolios with stats banner.
 * BUG FIX: Uses `p.id` (not `p._id`) for keys, delete handler, and list filtering.
 */

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PortfolioCard from "@/components/PortfolioCard";
import { apiFetch } from "@/lib/api";
import { PORTFOLIO_ENDPOINTS, ROUTES } from "@/lib/constants";
import { showToast } from "@/components/Toast";
import styles from "./dashboard.module.css";

function DashboardContent() {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPortfolios = useCallback(async () => {
    try {
      const res = await apiFetch(PORTFOLIO_ENDPOINTS.MY);
      const list = Array.isArray(res?.data?.portfolios)
        ? res.data.portfolios
        : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.portfolios)
            ? res.portfolios
            : Array.isArray(res)
              ? res
              : [];
      setPortfolios(list);
    } catch {
      showToast("Failed to load portfolios", "error");
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
      setPortfolios((prev) => prev.filter((p) => p.id !== id)); // ← FIX: was `p._id`
      showToast("Portfolio deleted", "success");
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const personalCount = portfolios.filter(
    (p) => p.category === "personal",
  ).length;
  const businessCount = portfolios.filter(
    (p) => p.category === "business",
  ).length;

  return (
    <div className={styles.page}>
      {/* Welcome banner */}
      <div className={styles.welcome}>
        <div className={styles.welcomeGlow} />
        <div className={styles.welcomeInner}>
          <div>
            <h1 className={styles.welcomeTitle}>
              Welcome back,{" "}
              <span className={styles.welcomeName}>
                {user?.username || "there"}
              </span>
            </h1>
            <p className={styles.welcomeSub}>
              Manage and create your professional portfolios
            </p>
          </div>
          <Link href={ROUTES.CREATE_PORTFOLIO} className={styles.createBtn}>
            + New Portfolio
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statNum}>{portfolios.length}</span>
          <span className={styles.statLabel}>Total</span>
        </div>
        <div className={styles.statCard}>
          <span className={`${styles.statNum} ${styles.personalNum}`}>
            {personalCount}
          </span>
          <span className={styles.statLabel}>Personal</span>
        </div>
        <div className={styles.statCard}>
          <span className={`${styles.statNum} ${styles.businessNum}`}>
            {businessCount}
          </span>
          <span className={styles.statLabel}>Business</span>
        </div>
      </div>

      {/* Portfolio grid */}
      {loading ? (
        <div className={styles.loader}>
          <div className="spinner" />
          <p>Loading portfolios…</p>
        </div>
      ) : portfolios.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📂</div>
          <h2 className={styles.emptyTitle}>No portfolios yet</h2>
          <p className={styles.emptyDesc}>
            Create your first portfolio to get started
          </p>
          <Link href={ROUTES.CREATE_PORTFOLIO} className={styles.createBtn}>
            + Create Portfolio
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {portfolios.map((p) => (
            <PortfolioCard
              key={p.id} /* ← FIX: was `p._id` */
              portfolio={p}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
