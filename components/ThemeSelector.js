"use client";

/**
 * ThemeSelector — shows themes for user to pick.
 *
 * Tries to fetch from backend first. If the API returns nothing or fails,
 * falls back to polished built-in themes.
 *
 * Props:
 *   category  — "personal" | "business"
 *   value     — currently selected theme id
 *   onChange  — (id, isBuiltIn) => void  — second arg tells caller if it's a
 *               frontend-only theme (so it shouldn't be sent to the backend)
 */

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { THEME_ENDPOINTS } from "@/lib/constants";
import styles from "./ThemeSelector.module.css";

/* ─── Built-in themes (used when backend has none) ─── */

const BUILTIN_THEMES = [
  {
    id: "midnight",
    name: "Midnight",
    desc: "Deep dark with violet accents",
    color: "#7c3aed",
    gradient: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
  },
  {
    id: "ocean",
    name: "Ocean",
    desc: "Cool blue waves",
    color: "#0ea5e9",
    gradient: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
  },
  {
    id: "aurora",
    name: "Aurora",
    desc: "Northern lights glow",
    color: "#10b981",
    gradient: "linear-gradient(135deg, #0d1117, #1a3a2a, #0d4b3c)",
  },
  {
    id: "sunset",
    name: "Sunset",
    desc: "Warm amber & rose tones",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #1a1a2e, #4a1942, #6b2737)",
  },
  {
    id: "neon",
    name: "Neon",
    desc: "Electric pink & cyan pop",
    color: "#ec4899",
    gradient: "linear-gradient(135deg, #0a0a1a, #1a0a2e, #2a0a3e)",
  },
  {
    id: "minimal",
    name: "Minimal",
    desc: "Clean monochrome elegance",
    color: "#94a3b8",
    gradient: "linear-gradient(135deg, #111827, #1f2937, #374151)",
  },
  {
    id: "forest",
    name: "Forest",
    desc: "Earthy greens & deep browns",
    color: "#22c55e",
    gradient: "linear-gradient(135deg, #0b1a0f, #1a3a1f, #2d4a2e)",
  },
  {
    id: "royal",
    name: "Royal",
    desc: "Rich gold & deep navy",
    color: "#eab308",
    gradient: "linear-gradient(135deg, #0c1220, #1a1a3e, #2a1f5e)",
  },
];

const BUILTIN_IDS = new Set(BUILTIN_THEMES.map((t) => t.id));

export function isBuiltInTheme(id) {
  return BUILTIN_IDS.has(id);
}

export default function ThemeSelector({ category, value, onChange }) {
  const [themes, setThemes] = useState([]);
  const [usingBuiltIn, setUsingBuiltIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const res = await apiFetch(THEME_ENDPOINTS.BY_CATEGORY(category));
        const raw = Array.isArray(res?.data?.themes)
          ? res.data.themes
          : Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res?.themes)
              ? res.themes
              : Array.isArray(res)
                ? res
                : [];
        if (!cancelled) {
          if (Array.isArray(raw) && raw.length > 0) {
            setThemes(raw);
            setUsingBuiltIn(false);
            if (!value) {
              const firstId = raw[0].id || raw[0]._id;
              if (firstId) onChange(firstId, false);
            }
          } else {
            setThemes(BUILTIN_THEMES);
            setUsingBuiltIn(true);
            if (!value) onChange(BUILTIN_THEMES[0].id, true);
          }
        }
      } catch {
        if (!cancelled) {
          setThemes(BUILTIN_THEMES);
          setUsingBuiltIn(true);
          if (!value) onChange(BUILTIN_THEMES[0].id, true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [category]); // eslint-disable-line react-hooks/exhaustive-deps

  // Safety net: if themes somehow ended up empty after loading, force built-in themes
  const displayThemes =
    !loading && themes.length === 0 ? BUILTIN_THEMES : themes;
  const isBuiltIn = usingBuiltIn || (!loading && themes.length === 0);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className="spinner" />
        <p>Loading themes…</p>
      </div>
    );
  }

  return (
    <>
      {isBuiltIn && (
        <p className={styles.builtInNote}>
          These are visual presets. Your portfolio will use a default theme
          style.
        </p>
      )}
      <div className={styles.grid}>
        {displayThemes.map((t, idx) => {
          const themeId = t._id || t.id;
          const color = t.color || t.primary_color || "#7c3aed";
          const bg =
            t.gradient ||
            `linear-gradient(135deg, ${color}, ${color}88, ${color}44)`;
          return (
            <div
              key={themeId}
              className={`${styles.card} ${value === themeId ? styles.selected : ""}`}
              onClick={() => onChange(themeId, isBuiltIn)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && onChange(themeId, isBuiltIn)
              }
            >
              <div className={styles.preview} style={{ background: bg }}>
                <div className={styles.previewLine} />
                <div className={styles.previewLineShort} />
                <div className={styles.previewDots}>
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <h4 className={styles.name}>{t.name || `Theme ${idx + 1}`}</h4>
              <p className={styles.desc}>{t.description || t.desc || ""}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}
