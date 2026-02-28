"use client";

/**
 * PortfolioView — public portfolio renderer.
 *
 * BUG FIX: All category-specific fields live inside `portfolio.data`,
 * NOT at the top level. Top-level fields are: id, slug, category,
 * theme_id, title, subtitle, created_at, updated_at, data.
 *
 * Renders full sections for Personal and Business portfolios.
 */

import styles from "../portfolio.module.css";

export default function PortfolioView({ portfolio, error }) {
  if (error || !portfolio) {
    return (
      <div className={styles.notFound}>
        <div className={styles.notFoundIcon}>🔍</div>
        <h1 className={styles.notFoundTitle}>Portfolio Not Found</h1>
        <p className={styles.notFoundDesc}>
          {error || "This portfolio does not exist."}
        </p>
        <a href="/" className={styles.notFoundLink}>
          ← Back to Home
        </a>
      </div>
    );
  }

  const isPersonal = portfolio.category === "personal";
  // FIX: read all category-specific fields from portfolio.data
  const d = portfolio.data || {};

  return (
    <div className={styles.page}>
      {isPersonal ? (
        <PersonalView portfolio={portfolio} d={d} />
      ) : (
        <BusinessView portfolio={portfolio} d={d} />
      )}
    </div>
  );
}

/* ===================== PERSONAL PORTFOLIO ===================== */

function PersonalView({ portfolio, d }) {
  const skills = Array.isArray(d.skills) ? d.skills : parseList(d.skills);
  const hasContact =
    d.contact_email || d.linkedin_url || d.github_url || d.twitter_url;

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroInner}>
          <div className={styles.avatar}>
            {(d.full_name || "?").charAt(0).toUpperCase()}
          </div>
          <h1 className={styles.heroTitle}>{d.full_name || portfolio.title}</h1>
          {(d.headline || portfolio.subtitle) && (
            <p className={styles.heroSub}>{d.headline || portfolio.subtitle}</p>
          )}
          {hasContact && (
            <div className={styles.heroLinks}>
              {d.linkedin_url && (
                <a
                  href={d.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  LinkedIn
                </a>
              )}
              {d.github_url && (
                <a
                  href={d.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  GitHub
                </a>
              )}
              {d.twitter_url && (
                <a
                  href={d.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  Twitter
                </a>
              )}
              {d.contact_email && (
                <a
                  href={`mailto:${d.contact_email}`}
                  className={styles.socialLink}
                >
                  Email
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* About */}
      {d.about && (
        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>About</h2>
            <p className={styles.text}>{d.about}</p>
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>Skills</h2>
            <div className={styles.tags}>
              {skills.map((s, i) => (
                <span key={i} className={styles.tag}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience */}
      {d.experience &&
        (Array.isArray(d.experience) ? d.experience.length > 0 : true) && (
          <section className={styles.section}>
            <div className={styles.sectionInner}>
              <h2 className={styles.sectionTitle}>Experience</h2>
              <div className={styles.timeline}>
                {Array.isArray(d.experience)
                  ? d.experience.map((exp, i) => (
                      <div key={i} className={styles.timelineItem}>
                        <div className={styles.timelineDot} />
                        <div>
                          {exp.title && <strong>{exp.title}</strong>}
                          {exp.company && <span> at {exp.company}</span>}
                          {(exp.start_date || exp.end_date) && (
                            <div className={styles.timelineMeta}>
                              {exp.start_date}
                              {exp.end_date ? ` — ${exp.end_date}` : ""}
                            </div>
                          )}
                          {exp.description && (
                            <p className={styles.text}>{exp.description}</p>
                          )}
                        </div>
                      </div>
                    ))
                  : parseBlocks(d.experience).map((block, i) => (
                      <div key={i} className={styles.timelineItem}>
                        <div className={styles.timelineDot} />
                        <p className={styles.text}>{block}</p>
                      </div>
                    ))}
              </div>
            </div>
          </section>
        )}

      {/* Education */}
      {d.education &&
        (Array.isArray(d.education) ? d.education.length > 0 : true) && (
          <section className={`${styles.section} ${styles.sectionAlt}`}>
            <div className={styles.sectionInner}>
              <h2 className={styles.sectionTitle}>Education</h2>
              <div className={styles.timeline}>
                {Array.isArray(d.education)
                  ? d.education.map((edu, i) => (
                      <div key={i} className={styles.timelineItem}>
                        <div className={styles.timelineDot} />
                        <div>
                          {edu.degree && <strong>{edu.degree}</strong>}
                          {edu.institution && <span> — {edu.institution}</span>}
                          {(edu.start_date || edu.end_date) && (
                            <div className={styles.timelineMeta}>
                              {edu.start_date}
                              {edu.end_date ? ` — ${edu.end_date}` : ""}
                            </div>
                          )}
                          {edu.description && (
                            <p className={styles.text}>{edu.description}</p>
                          )}
                        </div>
                      </div>
                    ))
                  : parseBlocks(d.education).map((block, i) => (
                      <div key={i} className={styles.timelineItem}>
                        <div className={styles.timelineDot} />
                        <p className={styles.text}>{block}</p>
                      </div>
                    ))}
              </div>
            </div>
          </section>
        )}

      {/* Contact */}
      {hasContact && (
        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>Get in Touch</h2>
            <div className={styles.contactGrid}>
              {d.contact_email && (
                <ContactItem
                  icon="✉️"
                  label="Email"
                  value={d.contact_email}
                  href={`mailto:${d.contact_email}`}
                />
              )}
              {d.linkedin_url && (
                <ContactItem
                  icon="🔗"
                  label="LinkedIn"
                  value="Profile"
                  href={d.linkedin_url}
                />
              )}
              {d.github_url && (
                <ContactItem
                  icon="💻"
                  label="GitHub"
                  value="Profile"
                  href={d.github_url}
                />
              )}
              {d.twitter_url && (
                <ContactItem
                  icon="🐦"
                  label="Twitter"
                  value="Profile"
                  href={d.twitter_url}
                />
              )}
            </div>
          </div>
        </section>
      )}

      <Footer slug={portfolio.slug} />
    </>
  );
}

/* ===================== BUSINESS PORTFOLIO ===================== */

function BusinessView({ portfolio, d }) {
  const services = Array.isArray(d.services)
    ? d.services
    : parseList(d.services);
  const hasContact = d.contact_email || d.phone || d.website || d.location;

  return (
    <>
      {/* Hero */}
      <section className={`${styles.hero} ${styles.heroBusiness}`}>
        <div className={styles.heroGlow} />
        <div className={styles.heroInner}>
          <span className={styles.heroBadge}>Business</span>
          <h1 className={styles.heroTitle}>
            {d.business_name || portfolio.title}
          </h1>
          {(d.tagline || portfolio.subtitle) && (
            <p className={styles.heroSub}>{d.tagline || portfolio.subtitle}</p>
          )}
          {d.website && (
            <a
              href={d.website}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.heroWebsite}
            >
              Visit Website →
            </a>
          )}
        </div>
      </section>

      {/* About */}
      {d.description && (
        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>About Us</h2>
            <p className={styles.text}>{d.description}</p>
          </div>
        </section>
      )}

      {/* Services */}
      {services.length > 0 && (
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>Services</h2>
            <div className={styles.serviceGrid}>
              {services.map((s, i) => (
                <div key={i} className={styles.serviceCard}>
                  <div className={styles.serviceIcon}>✦</div>
                  <p className={styles.serviceName}>{s}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {d.testimonials &&
        (Array.isArray(d.testimonials) ? d.testimonials.length > 0 : true) && (
          <section className={styles.section}>
            <div className={styles.sectionInner}>
              <h2 className={styles.sectionTitle}>Testimonials</h2>
              <div className={styles.testimonialGrid}>
                {Array.isArray(d.testimonials)
                  ? d.testimonials.map((t, i) => (
                      <blockquote key={i} className={styles.testimonialCard}>
                        <p className={styles.testimonialText}>
                          &ldquo;{t.quote || t}&rdquo;
                        </p>
                        {(t.name || t.role) && (
                          <footer className={styles.testimonialAuthor}>
                            {t.name && <strong>{t.name}</strong>}
                            {t.role && <span> — {t.role}</span>}
                          </footer>
                        )}
                      </blockquote>
                    ))
                  : parseBlocks(d.testimonials).map((t, i) => (
                      <blockquote key={i} className={styles.testimonialCard}>
                        <p className={styles.testimonialText}>
                          &ldquo;{t}&rdquo;
                        </p>
                      </blockquote>
                    ))}
              </div>
            </div>
          </section>
        )}

      {/* Contact */}
      {hasContact && (
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.sectionInner}>
            <h2 className={styles.sectionTitle}>Contact</h2>
            <div className={styles.contactGrid}>
              {d.contact_email && (
                <ContactItem
                  icon="✉️"
                  label="Email"
                  value={d.contact_email}
                  href={`mailto:${d.contact_email}`}
                />
              )}
              {d.phone && (
                <ContactItem
                  icon="📞"
                  label="Phone"
                  value={d.phone}
                  href={`tel:${d.phone}`}
                />
              )}
              {d.website && (
                <ContactItem
                  icon="🌐"
                  label="Website"
                  value={d.website}
                  href={d.website}
                />
              )}
              {d.location && (
                <ContactItem icon="📍" label="Location" value={d.location} />
              )}
            </div>
          </div>
        </section>
      )}

      <Footer slug={portfolio.slug} />
    </>
  );
}

/* ===================== SHARED HELPERS ===================== */

function ContactItem({ icon, label, value, href }) {
  return (
    <div className={styles.contactItem}>
      <span className={styles.contactIcon}>{icon}</span>
      <div>
        <span className={styles.contactLabel}>{label}</span>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactValue}
          >
            {value}
          </a>
        ) : (
          <span className={styles.contactValue}>{value}</span>
        )}
      </div>
    </div>
  );
}

function Footer({ slug }) {
  return (
    <footer className={styles.portfolioFooter}>
      <p>
        Built with{" "}
        <a href="/" className={styles.footerBrand}>
          OpenPersona
        </a>
      </p>
    </footer>
  );
}

/** Parse comma-separated or newline-separated string into an array of trimmed strings */
function parseList(str) {
  if (!str) return [];
  return str
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Parse newline-separated string into paragraphs / blocks */
function parseBlocks(str) {
  if (!str) return [];
  return str
    .split(/\n\n|\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}
