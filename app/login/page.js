"use client";

/**
 * Login page — email + password authentication.
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { showToast } from "@/components/Toast";
import { ROUTES } from "@/lib/constants";
import styles from "../auth.module.css";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (serverError) setServerError("");
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError("");

    try {
      await login(form.email, form.password);
      showToast("Welcome back!", "success");
      router.push(ROUTES.DASHBOARD);
    } catch (err) {
      const fieldErrors = err.data?.errors;
      if (Array.isArray(fieldErrors) && fieldErrors.length) {
        const mapped = {};
        fieldErrors.forEach((e) => {
          if (e.field) mapped[e.field] = e.message;
        });
        if (Object.keys(mapped).length) {
          setErrors(mapped);
        } else {
          setServerError(fieldErrors.map((e) => e.message || e.msg).join(", "));
        }
      } else {
        setServerError(err.message || "Login failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to your OpenPersona account</p>

        {serverError && <div className={styles.serverError}>{serverError}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && (
              <span className={styles.errorText}>{errors.email}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {errors.password && (
              <span className={styles.errorText}>{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting}
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className={styles.footer}>
          Don&apos;t have an account?{" "}
          <Link href={ROUTES.REGISTER} className={styles.footerLink}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
