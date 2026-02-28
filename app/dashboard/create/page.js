"use client";

/**
 * Create Portfolio — multi-step wizard.
 *
 * Step 1: Select category (personal / business)
 * Step 2: Select theme
 * Step 3: Fill in form fields
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import ThemeSelector from "@/components/ThemeSelector";
import PersonalPortfolioForm from "@/components/PersonalPortfolioForm";
import BusinessPortfolioForm from "@/components/BusinessPortfolioForm";
import { apiFetch } from "@/lib/api";
import { PORTFOLIO_ENDPOINTS, ROUTES, CATEGORIES } from "@/lib/constants";
import { showToast } from "@/components/Toast";
import styles from "./create.module.css";

export default function CreatePortfolioPage() {
  return (
    <ProtectedRoute>
      <CreateWizard />
    </ProtectedRoute>
  );
}

function CreateWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [themeId, setThemeId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* -- Step navigation -- */
  const goNext = () => setStep((s) => Math.min(s + 1, 3));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  /* -- Submit handler -- */
  const handleFormSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const body = {
        ...formData,
        category,
        theme_id: themeId,
      };

      await apiFetch(PORTFOLIO_ENDPOINTS.CREATE, {
        method: "POST",
        body,
      });

      showToast("Portfolio created successfully!", "success");
      router.push(ROUTES.DASHBOARD);
    } catch (err) {
      const fieldErrors = err.data?.errors;
      if (Array.isArray(fieldErrors) && fieldErrors.length) {
        const messages = fieldErrors
          .map((e) => e.message || e.msg)
          .filter(Boolean);
        showToast(messages.join(" • ") || err.message, "error");
      } else {
        showToast(err.message || "Failed to create portfolio", "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  /* -- Step indicator -- */
  const stepLabels = ["Category", "Theme", "Details"];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Create Portfolio</h1>
        <p className={styles.subtitle}>
          Follow the steps to build your portfolio.
        </p>
      </div>

      {/* Steps indicator */}
      <div className={styles.steps}>
        {stepLabels.map((label, i) => {
          const num = i + 1;
          const isActive = step === num;
          const isCompleted = step > num;
          return (
            <div key={num} style={{ display: "contents" }}>
              <div
                className={`${styles.step} ${
                  isActive ? styles.stepActive : ""
                } ${isCompleted ? styles.stepCompleted : ""}`}
              >
                <span className={styles.stepNumber}>
                  {isCompleted ? "✓" : num}
                </span>
                {label}
              </div>
              {num < stepLabels.length && (
                <div className={styles.stepDivider} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1 — Category */}
      {step === 1 && (
        <>
          <div className={styles.categoryGrid}>
            <div
              className={`${styles.categoryCard} ${
                category === CATEGORIES.PERSONAL
                  ? styles.categoryCardSelected
                  : ""
              }`}
              onClick={() => setCategory(CATEGORIES.PERSONAL)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && setCategory(CATEGORIES.PERSONAL)
              }
            >
              <div className={styles.categoryIcon}>👤</div>
              <h3 className={styles.categoryTitle}>Personal</h3>
              <p className={styles.categoryDesc}>
                Showcase your skills, experience, and projects as an individual.
              </p>
            </div>

            <div
              className={`${styles.categoryCard} ${
                category === CATEGORIES.BUSINESS
                  ? styles.categoryCardSelected
                  : ""
              }`}
              onClick={() => setCategory(CATEGORIES.BUSINESS)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && setCategory(CATEGORIES.BUSINESS)
              }
            >
              <div className={styles.categoryIcon}>🏢</div>
              <h3 className={styles.categoryTitle}>Business</h3>
              <p className={styles.categoryDesc}>
                Present your company&apos;s services, testimonials, and contact
                info.
              </p>
            </div>
          </div>

          <div className={styles.navBtns}>
            <button
              className={styles.nextBtn}
              onClick={goNext}
              disabled={!category}
            >
              Next →
            </button>
          </div>
        </>
      )}

      {/* Step 2 — Theme */}
      {step === 2 && (
        <>
          <ThemeSelector
            category={category}
            value={themeId}
            onChange={setThemeId}
          />

          <div className={styles.navBtns}>
            <button className={styles.backBtn} onClick={goBack}>
              ← Back
            </button>
            <button
              className={styles.nextBtn}
              onClick={goNext}
              disabled={!themeId}
            >
              Next →
            </button>
          </div>
        </>
      )}

      {/* Step 3 — Form */}
      {step === 3 && (
        <>
          <div
            className={styles.navBtns}
            style={{ marginTop: 0, marginBottom: "1.5rem" }}
          >
            <button className={styles.backBtn} onClick={goBack}>
              ← Back
            </button>
          </div>

          {category === CATEGORIES.PERSONAL ? (
            <PersonalPortfolioForm
              onSubmit={handleFormSubmit}
              submitting={submitting}
            />
          ) : (
            <BusinessPortfolioForm
              onSubmit={handleFormSubmit}
              submitting={submitting}
            />
          )}
        </>
      )}
    </div>
  );
}
