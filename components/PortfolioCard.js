"use client";

/**
 * PortfolioCard — displays a portfolio summary in the dashboard grid.
 * BUG FIX: Uses `portfolio.id` (not `_id`) for Edit/Delete.
 * Uses `portfolio.slug` for public View link.
 */

import Link from "next/link";
import styles from "./PortfolioCard.module.css";

export default function PortfolioCard({ portfolio, onDelete }) {
  const isPersonal = portfolio.category === "personal";

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this portfolio?")) {
      onDelete(portfolio.id); // ← FIX: was `portfolio._id`
    }
  };

  return (
    <div
      className={`${styles.card} ${isPersonal ? styles.personal : styles.business}`}
    >
      <div className={styles.stripe} />

      <div className={styles.body}>
        <span className={styles.badge}>
          {isPersonal ? "👤 Personal" : "🏢 Business"}
        </span>

        <h3 className={styles.title}>{portfolio.title || "Untitled"}</h3>
        <p className={styles.subtitle}>{portfolio.subtitle || "No subtitle"}</p>

        <div className={styles.meta}>
          <span className={styles.slug}>/{portfolio.slug}</span>
          <span className={styles.date}>
            {new Date(portfolio.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className={styles.actions}>
        <Link
          href={`/p/${portfolio.slug}`}
          className={styles.btnView}
          target="_blank"
        >
          View
        </Link>
        <Link
          href={`/dashboard/edit/${portfolio.id}`} /* ← FIX: was `portfolio._id` */
          className={styles.btnEdit}
        >
          Edit
        </Link>
        <button className={styles.btnDelete} onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
