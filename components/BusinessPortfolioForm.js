"use client";

/**
 * BusinessPortfolioForm — form fields for a "business" portfolio.
 * Handles services (dynamic list) and testimonials (dynamic list).
 */

import { useState } from "react";
import styles from "./Form.module.css";

const EMPTY_SERVICE = { name: "", description: "", price: "" };
const EMPTY_TESTIMONIAL = { author: "", role: "", text: "" };

export default function BusinessPortfolioForm({
  initialData,
  onSubmit,
  submitting,
}) {
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    business_name: "",
    tagline: "",
    description: "",
    services: [{ ...EMPTY_SERVICE }],
    testimonials: [{ ...EMPTY_TESTIMONIAL }],
    contact_email: "",
    phone: "",
    website: "",
    location: "",
    ...initialData,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
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
    if (!form.business_name.trim())
      errs.business_name = "Business name is required";
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
              placeholder="My Business Portfolio"
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

      {/* Business details */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>🏢 Business Details</h3>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Business Name *</label>
            <input
              className={`${styles.input} ${errors.business_name ? styles.inputError : ""}`}
              name="business_name"
              value={form.business_name}
              onChange={handleChange}
              placeholder="Acme Inc."
            />
            {errors.business_name && (
              <span className={styles.errorText}>{errors.business_name}</span>
            )}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Tagline</label>
            <input
              className={styles.input}
              name="tagline"
              value={form.tagline}
              onChange={handleChange}
              placeholder="Innovation at its best"
            />
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Tell visitors about your business…"
            rows={4}
          />
        </div>
      </div>

      {/* Services */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>🛎️ Services</h3>
        {form.services.map((svc, idx) => (
          <div key={idx} className={styles.listItem}>
            {form.services.length > 1 && (
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeListItem("services", idx)}
              >
                ×
              </button>
            )}
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Service Name</label>
                <input
                  className={styles.input}
                  value={svc.name}
                  onChange={(e) =>
                    updateListItem("services", idx, "name", e.target.value)
                  }
                  placeholder="Web Design"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Price</label>
                <input
                  className={styles.input}
                  value={svc.price}
                  onChange={(e) =>
                    updateListItem("services", idx, "price", e.target.value)
                  }
                  placeholder="$999"
                />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Description</label>
              <textarea
                className={styles.textarea}
                value={svc.description}
                onChange={(e) =>
                  updateListItem("services", idx, "description", e.target.value)
                }
                placeholder="What does this service include?"
                rows={2}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          className={styles.addBtn}
          onClick={() => addListItem("services", EMPTY_SERVICE)}
        >
          + Add Service
        </button>
      </div>

      {/* Testimonials */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>⭐ Testimonials</h3>
        {form.testimonials.map((test, idx) => (
          <div key={idx} className={styles.listItem}>
            {form.testimonials.length > 1 && (
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeListItem("testimonials", idx)}
              >
                ×
              </button>
            )}
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Author</label>
                <input
                  className={styles.input}
                  value={test.author}
                  onChange={(e) =>
                    updateListItem(
                      "testimonials",
                      idx,
                      "author",
                      e.target.value,
                    )
                  }
                  placeholder="John Smith"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Role</label>
                <input
                  className={styles.input}
                  value={test.role}
                  onChange={(e) =>
                    updateListItem("testimonials", idx, "role", e.target.value)
                  }
                  placeholder="CEO at Widgets Co."
                />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Testimonial Text</label>
              <textarea
                className={styles.textarea}
                value={test.text}
                onChange={(e) =>
                  updateListItem("testimonials", idx, "text", e.target.value)
                }
                placeholder="What did the client say?"
                rows={2}
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          className={styles.addBtn}
          onClick={() => addListItem("testimonials", EMPTY_TESTIMONIAL)}
        >
          + Add Testimonial
        </button>
      </div>

      {/* Contact info */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>📞 Contact Info</h3>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Contact Email *</label>
            <input
              className={`${styles.input} ${errors.contact_email ? styles.inputError : ""}`}
              name="contact_email"
              type="email"
              value={form.contact_email}
              onChange={handleChange}
              placeholder="info@acme.com"
            />
            {errors.contact_email && (
              <span className={styles.errorText}>{errors.contact_email}</span>
            )}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Phone</label>
            <input
              className={styles.input}
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 555-123-4567"
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Website</label>
            <input
              className={styles.input}
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="https://acme.com"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Location</label>
            <input
              className={styles.input}
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="San Francisco, CA"
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
