"use client";

/**
 * ThemeSelector — renders a grid of available themes for a given category.
 */

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { THEME_ENDPOINTS } from "@/lib/constants";
import styles from "./ThemeSelector.module.css";

/**
 * Map theme IDs to preview colours for a visual swatch.
 */
const THEME_COLORS = {
  "personal-minimal": { bg: "#f8fafc", accent: "#4f46e5" },
  "personal-bold": { bg: "#1e293b", accent: "#f59e0b" },
  "personal-creative": { bg: "#fdf4ff", accent: "#d946ef" },
  "business-corporate": { bg: "#f0f9ff", accent: "#0369a1" },
  "business-modern": { bg: "#0f172a", accent: "#22d3ee" },
  "business-elegant": { bg: "#fefce8", accent: "#a16207" },
};

export default function ThemeSelector({ category, value, onChange }) {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;

    setLoading(true);
    apiFetch(THEME_ENDPOINTS.BY_CATEGORY(category))
      .then((res) => {
        setThemes(res?.data?.themes ?? []);
      })
      .catch(() => {
        // Fall back to a default list if the endpoint isn't available
        setThemes(
          category === "personal"
            ? [
                {
                  id: "personal-minimal",
                  name: "Minimal",
                  description: "Clean & simple",
                },
                {
                  id: "personal-bold",
                  name: "Bold",
                  description: "Dark & powerful",
                },
                {
                  id: "personal-creative",
                  name: "Creative",
                  description: "Colorful & unique",
                },
              ]
            : [
                {
                  id: "business-corporate",
                  name: "Corporate",
                  description: "Professional & trustworthy",
                },
                {
                  id: "business-modern",
                  name: "Modern",
                  description: "Sleek & contemporary",
                },
                {
                  id: "business-elegant",
                  name: "Elegant",
                  description: "Refined & sophisticated",
                },
              ],
        );
      })
      .finally(() => setLoading(false));
  }, [category]);

  if (loading) {
    return <div className="spinner" />;
  }

  return (
    <div className={styles.container}>
      {themes.map((theme) => {
        const themeId = theme.id || theme._id || theme.theme_id;
        const colors = THEME_COLORS[themeId] || {
          bg: "#f1f5f9",
          accent: "#4f46e5",
        };
        const isSelected = value === themeId;

        return (
          <div
            key={themeId}
            className={`${styles.card} ${isSelected ? styles.selected : ""}`}
            onClick={() => onChange(themeId)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onChange(themeId)}
          >
            <div
              className={styles.preview}
              style={{ background: colors.bg, color: colors.accent }}
            >
              Aa
            </div>
            <p className={styles.name}>{theme.name}</p>
            <p className={styles.description}>{theme.description}</p>
          </div>
        );
      })}
    </div>
  );
}
