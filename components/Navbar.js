"use client";

/**
 * Navbar — site-wide navigation with auth-aware links.
 */

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/constants";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href={ROUTES.HOME} className={styles.logo}>
          <span className={styles.logoIcon}>◈</span> OpenPersona
        </Link>

        {/* Hamburger (mobile) */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Links */}
        <ul
          className={`${styles.links} ${menuOpen ? styles.linksOpen : ""}`}
          onClick={() => setMenuOpen(false)}
        >
          {isAuthenticated ? (
            <>
              <li>
                <Link href={ROUTES.DASHBOARD} className={styles.link}>
                  Dashboard
                </Link>
              </li>
              <li>
                <span className={styles.link} style={{ cursor: "default" }}>
                  {user?.username || user?.email || "User"}
                </span>
              </li>
              <li>
                <button
                  className={`${styles.btn} ${styles.btnGhost}`}
                  onClick={logout}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href={ROUTES.LOGIN} className={styles.link}>
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.REGISTER}
                  className={`${styles.btn} ${styles.btnPrimary}`}
                >
                  Get Started
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
