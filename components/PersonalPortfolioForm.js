"use client";

/**
 * PersonalPortfolioForm — form fields for a "personal" portfolio.
 * Handles skills (tag list), experience (dynamic list), and education.
 */

import { useState } from "react";
import styles from "./Form.module.css";

const EMPTY_EXPERIENCE = {
  company: "",
  role: "",
  from: "",
  to: "",
  description: "",
};
const EMPTY_EDUCATION = { institution: "", degree: "", year: "" };

export default function PersonalPortfolioForm({
  initialData,
  onSubmit,
  submitting,
}) {
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    full_name: "",
    headline: "",
    about: "",
    skills: [],
    experience: [{ ...EMPTY_EXPERIENCE }],
    education: [{ ...EMPTY_EDUCATION }],
    contact_email: "",
    linkedin_url: "",
    github_url: "",
    twitter_url: "",
    ...initialData,
  });

  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState({});

  /** Simple field change handler */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /* ----- Skills ----- */
  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !form.skills.includes(trimmed)) {
      setForm((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
    }
    setSkillInput("");
  };

  const removeSkill = (idx) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== idx),
    }));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  /* ----- Dynamic list helpers ----- */
  const updateListItem = (listKey, idx, field, value) => {
    setForm((prev) => ({
      ...prev,
      [listKey]: prev[listKey].map((item, i) =>
        i === idx ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const addListItem = (listKey, empty) => {
    setForm((prev) => ({
      ...prev,
      [listKey]: [...prev[listKey], { ...empty }],
    }));
  };

  const removeListItem = (listKey, idx) => {
    setForm((prev) => ({
      ...prev,
      [listKey]: prev[listKey].filter((_, i) => i !== idx),
    }));
  };

  /* ----- Validation ----- */
  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.full_name.trim()) errs.full_name = "Full name is required";
    if (!form.headline.trim()) errs.headline = "Headline is required";
    if (!form.contact_email.trim())
      errs.contact_email = "Contact email is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Basic info */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>📋 Basic Info</h3>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Portfolio Title *</label>
            <input
              className={`${styles.input} ${errors.title ? styles.inputError : ""}`}
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="My Portfolio"
            />
            {errors.title && (
              <span className={styles.errorText}>{errors.title}</span>
            )}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Subtitle</label>
            <input
              className={styles.input}
              name="subtitle"
              value={form.subtitle}
              onChange={handleChange}
              placeholder="A short tagline"
            />
          </div>
        </div>
      </div>

      {/* Personal details */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>👤 Personal Details</h3>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Full Name *</label>
            <input
              className={`${styles.input} ${errors.full_name ? styles.inputError : ""}`}
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Jane Doe"
            />
            {errors.full_name && (
              <span className={styles.errorText}>{errors.full_name}</span>
            )}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Headline *</label>
            <input
              className={`${styles.input} ${errors.headline ? styles.inputError : ""}`}
              name="headline"
              value={form.headline}
              onChange={handleChange}
              placeholder="Full Stack Developer"
            />
            {errors.headline && (
              <span className={styles.errorText}>{errors.headline}</span>
            )}
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>About</label>
          <textarea
            className={styles.textarea}
            name="about"
            value={form.about}
            onChange={handleChange}
            placeholder="Tell visitors about yourself…"
            rows={4}
          />
        </div>
      </div>

      {/* Skills */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>🛠️ Skills</h3>
        <div
          style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}
        >
          <input
            className={styles.input}
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillKeyDown}
            placeholder="Type a skill and press Enter"
            style={{ flex: 1 }}
          />
          <button type="button" className={styles.addBtn} onClick={addSkill}>
            + Add
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {form.skills.map((skill, idx) => (
            <span
              key={idx}
              style={{
                padding: "0.25rem 0.7rem",
                background: "rgba(79,70,229,0.1)",
                color: "var(--color-primary)",
                borderRadius: "9999px",
                fontSize: "0.82rem",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(idx)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--color-error)",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  lineHeight: 1,
                  padding: 0,
                }}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>💼 Experience</h3>
        {form.experience.map((exp, idx) => (
          <div key={idx} className={styles.listItem}>
            {form.experience.length > 1 && (
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeListItem("experience", idx)}
              >
                ×
              </button>
            )}
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Company</label>
                <input
                  className={styles.input}
                  value={exp.company}
                  onChange={(e) =>
                    updateListItem("experience", idx, "company", e.target.value)
                  }
                  placeholder="Acme Corp"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Role</label>
                <input
                  className={styles.input}
                  value={exp.role}
                  onChange={(e) =>
                    updateListItem("experience", idx, "role", e.target.value)
                  }
                  placeholder="Senior Developer"
                />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>From</label>
                <input
                  className={styles.input}
                  value={exp.from}
                  onChange={(e) =>
                    updateListItem("experience", idx, "from", e.target.value)
                  }
                  placeholder="Jan 2020"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>To</label>
                <input
                  className={styles.input}
                  value={exp.to}
                  onChange={(e) =>
                    updateListItem("experience", idx, "to", e.target.value)
                  }
                  placeholder="Present"
                />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Description</label>
              <textarea
                className={styles.textarea}
                value={exp.description}
                onChange={(e) =>
                  updateListItem(
                    "experience",
                    idx,
                    "description",
                    e.target.value,
                  )
                }
                placeholder="What did you do?"
                rows={2}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          className={styles.addBtn}
          onClick={() => addListItem("experience", EMPTY_EXPERIENCE)}
        >
          + Add Experience
        </button>
      </div>

      {/* Education */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>🎓 Education</h3>
        {form.education.map((edu, idx) => (
          <div key={idx} className={styles.listItem}>
            {form.education.length > 1 && (
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeListItem("education", idx)}
              >
                ×
              </button>
            )}
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Institution</label>
                <input
                  className={styles.input}
                  value={edu.institution}
                  onChange={(e) =>
                    updateListItem(
                      "education",
                      idx,
                      "institution",
                      e.target.value,
                    )
                  }
                  placeholder="MIT"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Degree</label>
                <input
                  className={styles.input}
                  value={edu.degree}
                  onChange={(e) =>
                    updateListItem("education", idx, "degree", e.target.value)
                  }
                  placeholder="B.S. Computer Science"
                />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Year</label>
              <input
                className={styles.input}
                value={edu.year}
                onChange={(e) =>
                  updateListItem("education", idx, "year", e.target.value)
                }
                placeholder="2020"
                style={{ maxWidth: "200px" }}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          className={styles.addBtn}
          onClick={() => addListItem("education", EMPTY_EDUCATION)}
        >
          + Add Education
        </button>
      </div>

      {/* Contact & Social */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>🔗 Contact & Social</h3>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Contact Email *</label>
            <input
              className={`${styles.input} ${errors.contact_email ? styles.inputError : ""}`}
              name="contact_email"
              type="email"
              value={form.contact_email}
              onChange={handleChange}
              placeholder="jane@example.com"
            />
            {errors.contact_email && (
              <span className={styles.errorText}>{errors.contact_email}</span>
            )}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>LinkedIn URL</label>
            <input
              className={styles.input}
              name="linkedin_url"
              value={form.linkedin_url}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/jane"
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>GitHub URL</label>
            <input
              className={styles.input}
              name="github_url"
              value={form.github_url}
              onChange={handleChange}
              placeholder="https://github.com/jane"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Twitter URL</label>
            <input
              className={styles.input}
              name="twitter_url"
              value={form.twitter_url}
              onChange={handleChange}
              placeholder="https://twitter.com/jane"
            />
          </div>
        </div>
      </div>

      <button type="submit" className={styles.submitBtn} disabled={submitting}>
        {submitting ? "Saving…" : "Save Portfolio"}
      </button>
    </form>
  );
}
