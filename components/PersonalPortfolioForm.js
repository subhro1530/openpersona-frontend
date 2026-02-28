"use client";

/**
 * PersonalPortfolioForm — form fields for personal portfolios.
 *
 * Backend expects:
 *   skills      → string[]           e.g. ["React","Node.js"]
 *   experience  → object[]           e.g. [{title,company,start_date,end_date,description}]
 *   education   → object[]           e.g. [{degree,institution,start_date,end_date,description}]
 *
 * Has dynamic + buttons to add entries, and × to remove them.
 */

import { useState } from "react";
import styles from "./Form.module.css";

const EMPTY_EXP = {
  title: "",
  company: "",
  start_date: "",
  end_date: "",
  description: "",
};
const EMPTY_EDU = {
  degree: "",
  institution: "",
  start_date: "",
  end_date: "",
  description: "",
};

function initForm(initialData) {
  const d = initialData || {};
  return {
    title: d.title || "",
    subtitle: d.subtitle || "",
    slug: d.slug || "",
    full_name: d.full_name || "",
    headline: d.headline || "",
    about: d.about || "",
    contact_email: d.contact_email || "",
    linkedin_url: d.linkedin_url || "",
    github_url: d.github_url || "",
    twitter_url: d.twitter_url || "",
  };
}

function initSkills(initialData) {
  const s = initialData?.skills;
  if (Array.isArray(s)) return s;
  if (typeof s === "string" && s.trim())
    return s
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  return [];
}

function initArr(initialData, key, empty) {
  const a = initialData?.[key];
  if (Array.isArray(a) && a.length)
    return a.map((item) => ({ ...empty, ...item }));
  return [];
}

export default function PersonalPortfolioForm({
  initialData,
  onSubmit,
  submitting,
}) {
  const [form, setForm] = useState(() => initForm(initialData));
  const [skills, setSkills] = useState(() => initSkills(initialData));
  const [skillInput, setSkillInput] = useState("");
  const [experience, setExperience] = useState(() =>
    initArr(initialData, "experience", EMPTY_EXP),
  );
  const [education, setEducation] = useState(() =>
    initArr(initialData, "education", EMPTY_EDU),
  );
  const [errors, setErrors] = useState({});

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  /* ---- Skills ---- */
  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills((p) => [...p, s]);
    setSkillInput("");
  };
  const removeSkill = (i) => setSkills((p) => p.filter((_, idx) => idx !== i));
  const handleSkillKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

  /* ---- Experience ---- */
  const addExp = () => setExperience((p) => [...p, { ...EMPTY_EXP }]);
  const removeExp = (i) =>
    setExperience((p) => p.filter((_, idx) => idx !== i));
  const updateExp = (i, field, value) =>
    setExperience((p) =>
      p.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)),
    );

  /* ---- Education ---- */
  const addEdu = () => setEducation((p) => [...p, { ...EMPTY_EDU }]);
  const removeEdu = (i) => setEducation((p) => p.filter((_, idx) => idx !== i));
  const updateEdu = (i, field, value) =>
    setEducation((p) =>
      p.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)),
    );

  /* ---- Validate ---- */
  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.full_name.trim()) e.full_name = "Full name is required";
    if (!form.slug.trim()) e.slug = "Slug is required";
    else if (!/^[a-z0-9-]+$/.test(form.slug))
      e.slug = "Slug can only contain lowercase letters, numbers, and hyphens";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---- Submit ---- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await onSubmit({
        ...form,
        skills,
        experience: experience.filter((x) => x.title || x.company),
        education: education.filter((x) => x.degree || x.institution),
      });
    } catch (err) {
      const fieldErrors = err?.data?.errors;
      if (Array.isArray(fieldErrors)) {
        const mapped = {};
        fieldErrors.forEach((fe) => {
          if (fe.field) mapped[fe.field] = fe.message;
        });
        if (Object.keys(mapped).length) setErrors(mapped);
      }
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* ---- Basic Info ---- */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>📋 Basic Info</h3>
        <div className={styles.row}>
          <Field
            label="Portfolio Title *"
            name="title"
            value={form.title}
            onChange={onChange}
            error={errors.title}
          />
          <Field
            label="Subtitle"
            name="subtitle"
            value={form.subtitle}
            onChange={onChange}
          />
        </div>
        <Field
          label="Slug *"
          name="slug"
          value={form.slug}
          onChange={onChange}
          error={errors.slug}
          hint="URL-friendly (e.g. jane-doe)"
        />
      </div>

      {/* ---- Personal Details ---- */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>👤 Personal Details</h3>
        <div className={styles.row}>
          <Field
            label="Full Name *"
            name="full_name"
            value={form.full_name}
            onChange={onChange}
            error={errors.full_name}
          />
          <Field
            label="Headline"
            name="headline"
            value={form.headline}
            onChange={onChange}
            placeholder="e.g. Full-Stack Developer"
          />
        </div>
        <FieldTextarea
          label="About"
          name="about"
          value={form.about}
          onChange={onChange}
          rows={4}
          placeholder="Tell your story…"
        />
      </div>

      {/* ---- Skills (tags) ---- */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>🛠️ Skills</h3>
          <span className={styles.sectionCount}>{skills.length} added</span>
        </div>
        <div className={styles.tagInputRow}>
          <input
            className={styles.input}
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillKey}
            placeholder="Type a skill and press Enter"
          />
          <button
            type="button"
            className={styles.addBtnSmall}
            onClick={addSkill}
          >
            + Add
          </button>
        </div>
        {skills.length > 0 && (
          <div className={styles.tags}>
            {skills.map((s, i) => (
              <span key={i} className={styles.tag}>
                {s}
                <button
                  type="button"
                  className={styles.tagRemove}
                  onClick={() => removeSkill(i)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ---- Experience (dynamic cards) ---- */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>💼 Experience</h3>
          <button type="button" className={styles.addBtn} onClick={addExp}>
            + Add Experience
          </button>
        </div>
        {experience.length === 0 && (
          <p className={styles.emptyHint}>
            No experience added yet. Click the button above to add one.
          </p>
        )}
        {experience.map((exp, i) => (
          <div key={i} className={styles.dynamicCard}>
            <button
              type="button"
              className={styles.cardRemove}
              onClick={() => removeExp(i)}
              title="Remove"
            >
              ×
            </button>
            <div className={styles.cardLabel}>Experience {i + 1}</div>
            <div className={styles.row}>
              <MiniField
                label="Job Title"
                value={exp.title}
                onChange={(v) => updateExp(i, "title", v)}
                placeholder="e.g. Software Engineer"
              />
              <MiniField
                label="Company"
                value={exp.company}
                onChange={(v) => updateExp(i, "company", v)}
                placeholder="e.g. Google"
              />
            </div>
            <div className={styles.row}>
              <MiniField
                label="Start Date"
                value={exp.start_date}
                onChange={(v) => updateExp(i, "start_date", v)}
                placeholder="e.g. Jan 2022"
              />
              <MiniField
                label="End Date"
                value={exp.end_date}
                onChange={(v) => updateExp(i, "end_date", v)}
                placeholder="Present"
              />
            </div>
            <MiniTextarea
              label="Description"
              value={exp.description}
              onChange={(v) => updateExp(i, "description", v)}
              rows={2}
            />
          </div>
        ))}
      </div>

      {/* ---- Education (dynamic cards) ---- */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>🎓 Education</h3>
          <button type="button" className={styles.addBtn} onClick={addEdu}>
            + Add Education
          </button>
        </div>
        {education.length === 0 && (
          <p className={styles.emptyHint}>
            No education added yet. Click the button above to add one.
          </p>
        )}
        {education.map((edu, i) => (
          <div key={i} className={styles.dynamicCard}>
            <button
              type="button"
              className={styles.cardRemove}
              onClick={() => removeEdu(i)}
              title="Remove"
            >
              ×
            </button>
            <div className={styles.cardLabel}>Education {i + 1}</div>
            <div className={styles.row}>
              <MiniField
                label="Degree / Certificate"
                value={edu.degree}
                onChange={(v) => updateEdu(i, "degree", v)}
                placeholder="e.g. B.Sc. Computer Science"
              />
              <MiniField
                label="Institution"
                value={edu.institution}
                onChange={(v) => updateEdu(i, "institution", v)}
                placeholder="e.g. MIT"
              />
            </div>
            <div className={styles.row}>
              <MiniField
                label="Start Date"
                value={edu.start_date}
                onChange={(v) => updateEdu(i, "start_date", v)}
                placeholder="e.g. Aug 2018"
              />
              <MiniField
                label="End Date"
                value={edu.end_date}
                onChange={(v) => updateEdu(i, "end_date", v)}
                placeholder="e.g. May 2022"
              />
            </div>
            <MiniTextarea
              label="Description"
              value={edu.description}
              onChange={(v) => updateEdu(i, "description", v)}
              rows={2}
            />
          </div>
        ))}
      </div>

      {/* ---- Contact & Links ---- */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>🔗 Contact & Links</h3>
        <Field
          label="Contact Email"
          name="contact_email"
          value={form.contact_email}
          onChange={onChange}
          type="email"
        />
        <div className={styles.row}>
          <Field
            label="LinkedIn URL"
            name="linkedin_url"
            value={form.linkedin_url}
            onChange={onChange}
            type="url"
            placeholder="https://linkedin.com/in/…"
          />
          <Field
            label="GitHub URL"
            name="github_url"
            value={form.github_url}
            onChange={onChange}
            type="url"
            placeholder="https://github.com/…"
          />
        </div>
        <Field
          label="Twitter / X URL"
          name="twitter_url"
          value={form.twitter_url}
          onChange={onChange}
          type="url"
          placeholder="https://x.com/…"
        />
      </div>

      <button type="submit" className={styles.submitBtn} disabled={submitting}>
        {submitting
          ? "Saving…"
          : initialData
            ? "Update Portfolio"
            : "Create Portfolio"}
      </button>
    </form>
  );
}

/* ======== Reusable field helpers ======== */

function Field({
  label,
  name,
  value,
  onChange,
  error,
  hint,
  type = "text",
  placeholder,
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${styles.input} ${error ? styles.inputError : ""}`}
      />
      {hint && !error && <span className={styles.hint}>{hint}</span>}
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}

function FieldTextarea({
  label,
  name,
  value,
  onChange,
  rows = 3,
  placeholder,
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={name}>
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className={styles.textarea}
      />
    </div>
  );
}

function MiniField({ label, value, onChange, placeholder }) {
  return (
    <div className={styles.field}>
      <label className={styles.miniLabel}>{label}</label>
      <input
        className={styles.input}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function MiniTextarea({ label, value, onChange, rows = 2 }) {
  return (
    <div className={styles.field}>
      <label className={styles.miniLabel}>{label}</label>
      <textarea
        className={styles.textarea}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder="Optional description…"
      />
    </div>
  );
}
