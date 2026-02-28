"use client";

/**
 * BusinessPortfolioForm — form fields for business portfolios.
 *
 * Backend expects:
 *   services     → string[]           e.g. ["Web Dev","Consulting"]
 *   testimonials → object[]           e.g. [{name,role,quote}]
 *
 * Has dynamic + buttons to add entries, and × to remove them.
 */

import { useState } from "react";
import styles from "./Form.module.css";

const EMPTY_TESTIMONIAL = { name: "", role: "", quote: "" };

function initForm(initialData) {
  const d = initialData || {};
  return {
    title: d.title || "",
    subtitle: d.subtitle || "",
    slug: d.slug || "",
    business_name: d.business_name || "",
    tagline: d.tagline || "",
    description: d.description || "",
    contact_email: d.contact_email || "",
    phone: d.phone || "",
    website: d.website || "",
    location: d.location || "",
  };
}

function initServices(initialData) {
  const s = initialData?.services;
  if (Array.isArray(s)) return s;
  if (typeof s === "string" && s.trim())
    return s
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  return [];
}

function initTestimonials(initialData) {
  const t = initialData?.testimonials;
  if (Array.isArray(t) && t.length)
    return t.map((item) => ({ ...EMPTY_TESTIMONIAL, ...item }));
  return [];
}

export default function BusinessPortfolioForm({
  initialData,
  onSubmit,
  submitting,
}) {
  const [form, setForm] = useState(() => initForm(initialData));
  const [services, setServices] = useState(() => initServices(initialData));
  const [serviceInput, setServiceInput] = useState("");
  const [testimonials, setTestimonials] = useState(() =>
    initTestimonials(initialData),
  );
  const [errors, setErrors] = useState({});

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  /* ---- Services (tags) ---- */
  const addService = () => {
    const s = serviceInput.trim();
    if (s && !services.includes(s)) setServices((p) => [...p, s]);
    setServiceInput("");
  };
  const removeService = (i) =>
    setServices((p) => p.filter((_, idx) => idx !== i));
  const handleServiceKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addService();
    }
  };

  /* ---- Testimonials ---- */
  const addTestimonial = () =>
    setTestimonials((p) => [...p, { ...EMPTY_TESTIMONIAL }]);
  const removeTestimonial = (i) =>
    setTestimonials((p) => p.filter((_, idx) => idx !== i));
  const updateTestimonial = (i, field, value) =>
    setTestimonials((p) =>
      p.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)),
    );

  /* ---- Validate ---- */
  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.business_name.trim())
      e.business_name = "Business name is required";
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
        services,
        testimonials: testimonials.filter((t) => t.quote || t.name),
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
          hint="URL-friendly (e.g. acme-corp)"
        />
      </div>

      {/* ---- Business Details ---- */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>🏢 Business Details</h3>
        <div className={styles.row}>
          <Field
            label="Business Name *"
            name="business_name"
            value={form.business_name}
            onChange={onChange}
            error={errors.business_name}
          />
          <Field
            label="Tagline"
            name="tagline"
            value={form.tagline}
            onChange={onChange}
            placeholder="e.g. Build better, faster"
          />
        </div>
        <FieldTextarea
          label="Description"
          name="description"
          value={form.description}
          onChange={onChange}
          rows={4}
          placeholder="Describe your business…"
        />
      </div>

      {/* ---- Services (tags) ---- */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>⚙️ Services</h3>
          <span className={styles.sectionCount}>{services.length} added</span>
        </div>
        <div className={styles.tagInputRow}>
          <input
            className={styles.input}
            value={serviceInput}
            onChange={(e) => setServiceInput(e.target.value)}
            onKeyDown={handleServiceKey}
            placeholder="Type a service and press Enter"
          />
          <button
            type="button"
            className={styles.addBtnSmall}
            onClick={addService}
          >
            + Add
          </button>
        </div>
        {services.length > 0 && (
          <div className={styles.tags}>
            {services.map((s, i) => (
              <span key={i} className={styles.tag}>
                {s}
                <button
                  type="button"
                  className={styles.tagRemove}
                  onClick={() => removeService(i)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ---- Testimonials (dynamic cards) ---- */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>💬 Testimonials</h3>
          <button
            type="button"
            className={styles.addBtn}
            onClick={addTestimonial}
          >
            + Add Testimonial
          </button>
        </div>
        {testimonials.length === 0 && (
          <p className={styles.emptyHint}>
            No testimonials added yet. Click the button above to add one.
          </p>
        )}
        {testimonials.map((t, i) => (
          <div key={i} className={styles.dynamicCard}>
            <button
              type="button"
              className={styles.cardRemove}
              onClick={() => removeTestimonial(i)}
              title="Remove"
            >
              ×
            </button>
            <div className={styles.cardLabel}>Testimonial {i + 1}</div>
            <div className={styles.row}>
              <MiniField
                label="Person Name"
                value={t.name}
                onChange={(v) => updateTestimonial(i, "name", v)}
                placeholder="e.g. John Smith"
              />
              <MiniField
                label="Role / Company"
                value={t.role}
                onChange={(v) => updateTestimonial(i, "role", v)}
                placeholder="e.g. CEO at Acme"
              />
            </div>
            <MiniTextarea
              label="Quote"
              value={t.quote}
              onChange={(v) => updateTestimonial(i, "quote", v)}
              rows={2}
              placeholder="What they said about you…"
            />
          </div>
        ))}
      </div>

      {/* ---- Contact Info ---- */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>🔗 Contact Info</h3>
        <div className={styles.row}>
          <Field
            label="Contact Email"
            name="contact_email"
            value={form.contact_email}
            onChange={onChange}
            type="email"
          />
          <Field
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={onChange}
            type="tel"
          />
        </div>
        <div className={styles.row}>
          <Field
            label="Website"
            name="website"
            value={form.website}
            onChange={onChange}
            type="url"
            placeholder="https://…"
          />
          <Field
            label="Location"
            name="location"
            value={form.location}
            onChange={onChange}
            placeholder="e.g. San Francisco, CA"
          />
        </div>
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

function MiniTextarea({ label, value, onChange, rows = 2, placeholder }) {
  return (
    <div className={styles.field}>
      <label className={styles.miniLabel}>{label}</label>
      <textarea
        className={styles.textarea}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder || "Optional…"}
      />
    </div>
  );
}
