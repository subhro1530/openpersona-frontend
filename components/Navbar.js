"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/constants";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const initial = (user?.username || user?.email || "U")[0].toUpperCase();

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href={ROUTES.HOME} className={styles.logo}>
          <span className={styles.logoIcon}>&#x25C8;</span>
          <span className={styles.logoText}>OpenPersona</span>
        </Link>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span
            className={`${styles.hamburgerLine} ${menuOpen ? styles.open : ""}`}
          />
          <span
            className={`${styles.hamburgerLine} ${menuOpen ? styles.open : ""}`}
          />
          <span
            className={`${styles.hamburgerLine} ${menuOpen ? styles.open : ""}`}
          />
        </button>

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
              <li className={styles.userInfo}>
                <div className={styles.avatar}>{initial}</div>
                <span className={styles.username}>
                  {user?.username || user?.email || "User"}
                </span>
              </li>
              <li>
                <button className={styles.logoutBtn} onClick={logout}>
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
                <Link href={ROUTES.REGISTER} className={styles.ctaBtn}>
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
