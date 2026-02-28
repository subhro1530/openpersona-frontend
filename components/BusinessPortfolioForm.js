"use client";

/**
 * BusinessPortfolioForm — form fields for business portfolios.
 *
 * Backend expects:
 *   services     → object[]  e.g. [{name,description,price}]
 *   testimonials → object[]  e.g. [{author,role,text}]
 *
 * Has dynamic + buttons to add entries, and × to remove them.
 */

import { useState } from "react";
import styles from "./Form.module.css";

const EMPTY_SERVICE = { name: "", description: "", price: "" };
const EMPTY_TESTIMONIAL = { author: "", role: "", text: "" };

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
  if (Array.isArray(s) && s.length)
    return s.map((item) =>
      typeof item === "string"
        ? { ...EMPTY_SERVICE, name: item }
        : { ...EMPTY_SERVICE, ...item },
    );
  return [];
}

function initTestimonials(initialData) {
  const t = initialData?.testimonials;
  if (Array.isArray(t) && t.length)
    return t.map((item) => ({
      ...EMPTY_TESTIMONIAL,
      author: item.author || item.name || "",
      role: item.role || "",
      text: item.text || item.quote || "",
    }));
  return [];
}

export default function BusinessPortfolioForm({
  initialData,
  onSubmit,
  submitting,
}) {
  const [form, setForm] = useState(() => initForm(initialData));
  const [services, setServices] = useState(() => initServices(initialData));
  const [testimonials, setTestimonials] = useState(() =>
    initTestimonials(initialData),
  );
  const [errors, setErrors] = useState({});

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  /* ---- Services (dynamic cards) ---- */
  const addService = () => setServices((p) => [...p, { ...EMPTY_SERVICE }]);
  const removeService = (i) =>
    setServices((p) => p.filter((_, idx) => idx !== i));
  const updateService = (i, field, value) =>
    setServices((p) =>
      p.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)),
    );

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
        services: services.filter((s) => s.name),
        testimonials: testimonials.filter((t) => t.text || t.author),
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

      {/* ---- Services (dynamic cards) ---- */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>⚙️ Services</h3>
          <button type="button" className={styles.addBtn} onClick={addService}>
            + Add Service
          </button>
        </div>
        {services.length === 0 && (
          <p className={styles.emptyHint}>
            No services added yet. Click the button above to add one.
          </p>
        )}
        {services.map((svc, i) => (
          <div key={i} className={styles.dynamicCard}>
            <button
              type="button"
              className={styles.cardRemove}
              onClick={() => removeService(i)}
              title="Remove"
            >
              ×
            </button>
            <div className={styles.cardLabel}>Service {i + 1}</div>
            <div className={styles.row}>
              <MiniField
                label="Service Name"
                value={svc.name}
                onChange={(v) => updateService(i, "name", v)}
                placeholder="e.g. Web Development"
              />
              <MiniField
                label="Price"
                value={svc.price}
                onChange={(v) => updateService(i, "price", v)}
                placeholder="e.g. $5000"
              />
            </div>
            <MiniTextarea
              label="Description"
              value={svc.description}
              onChange={(v) => updateService(i, "description", v)}
              rows={2}
              placeholder="Describe this service…"
            />
          </div>
        ))}
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
                label="Author"
                value={t.author}
                onChange={(v) => updateTestimonial(i, "author", v)}
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
              value={t.text}
              onChange={(v) => updateTestimonial(i, "text", v)}
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
