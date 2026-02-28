"use client";

/**
 * PortfolioCard — displays a portfolio summary in the dashboard grid.
 */

import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import styles from "./PortfolioCard.module.css";

export default function PortfolioCard({ portfolio, onDelete }) {
  const { _id, title, subtitle, category } = portfolio;
  const slug =
    portfolio.slug || portfolio.portfolio_slug || portfolio._id || "";

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this portfolio?")) {
      onDelete(_id);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <span
          className={`${styles.badge} ${
            category === "personal" ? styles.personal : styles.business
          }`}
        >
          {category}
        </span>
      </div>

      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

      <Link
        href={ROUTES.PUBLIC_PORTFOLIO(slug)}
        className={styles.slug}
        target="_blank"
      >
        /p/{slug}
      </Link>

      <div className={styles.actions}>
        <Link href={ROUTES.EDIT_PORTFOLIO(_id)} className={styles.editBtn}>
          Edit
        </Link>
        <Link
          href={ROUTES.PUBLIC_PORTFOLIO(slug)}
          className={styles.viewBtn}
          target="_blank"
        >
          View
        </Link>
        <button className={styles.deleteBtn} onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
