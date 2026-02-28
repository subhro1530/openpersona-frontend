"use client";

/**
 * Register page — create a new account.
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { showToast } from "@/components/Toast";
import { ROUTES } from "@/lib/constants";
import styles from "../auth.module.css";

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({ username: "", email: "", password: "" });
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
    if (!form.username.trim()) errs.username = "Username is required";
    else if (form.username.trim().length < 3)
      errs.username = "Username must be at least 3 characters";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 8)
      errs.password = "Password must be at least 8 characters";
    else if (!/[a-zA-Z]/.test(form.password))
      errs.password = "Password must contain at least one letter";
    else if (!/[0-9]/.test(form.password))
      errs.password = "Password must contain at least one number";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError("");

    try {
      await register(form.username, form.email, form.password);
      showToast("Account created! Welcome to OpenPersona.", "success");
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
        setServerError(err.message || "Registration failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create Account</h1>
        <p className={styles.subtitle}>Start building your portfolio today</p>

        {serverError && <div className={styles.serverError}>{serverError}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className={`${styles.input} ${errors.username ? styles.inputError : ""}`}
              value={form.username}
              onChange={handleChange}
              placeholder="janedoe"
              autoComplete="username"
            />
            {errors.username && (
              <span className={styles.errorText}>{errors.username}</span>
            )}
          </div>

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
              autoComplete="new-password"
            />
            {errors.password && (
              <span className={styles.errorText}>{errors.password}</span>
            )}
            <ul className={styles.passwordHints}>
              <li className={form.password.length >= 8 ? styles.hintMet : ""}>
                At least 8 characters
              </li>
              <li
                className={/[a-zA-Z]/.test(form.password) ? styles.hintMet : ""}
              >
                At least one letter
              </li>
              <li className={/[0-9]/.test(form.password) ? styles.hintMet : ""}>
                At least one number
              </li>
            </ul>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting}
          >
            {submitting ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{" "}
          <Link href={ROUTES.LOGIN} className={styles.footerLink}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
