"use client";

/**
 * PortfolioView — renders a portfolio based on category.
 * Handles both personal and business portfolios.
 * Sanitizes any user-generated content before rendering.
 */

import styles from "../portfolio.module.css";

/**
 * Basic HTML entity escaping to prevent XSS in user-generated strings.
 */
function sanitize(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default function PortfolioView({ portfolio, error }) {
  if (error || !portfolio) {
    return (
      <div className={styles.notFound}>
        <h1 className={styles.notFoundTitle}>Portfolio Not Found</h1>
        <p className={styles.notFoundDesc}>
          {error || "This portfolio does not exist or has been removed."}
        </p>
      </div>
    );
  }

  const isPersonal = portfolio.category === "personal";

  return (
    <div className={styles.page}>
      {/* Header banner */}
      <section className={styles.headerSection}>
        {isPersonal ? (
          <>
            <h1 className={styles.name}>{sanitize(portfolio.full_name)}</h1>
            {portfolio.headline && (
              <p className={styles.headline}>{sanitize(portfolio.headline)}</p>
            )}
          </>
        ) : (
          <>
            <h1 className={styles.businessName}>
              {sanitize(portfolio.business_name)}
            </h1>
            {portfolio.tagline && (
              <p className={styles.tagline}>{sanitize(portfolio.tagline)}</p>
            )}
          </>
        )}
      </section>

      {/* Content cards */}
      <div className={styles.content}>
        {isPersonal ? (
          <PersonalView portfolio={portfolio} />
        ) : (
          <BusinessView portfolio={portfolio} />
        )}
      </div>
    </div>
  );
}

/* ============================================= */
/*  Personal portfolio sections                   */
/* ============================================= */
function PersonalView({ portfolio }) {
  return (
    <>
      {/* About */}
      {portfolio.about && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>📝 About</h2>
          <p className={styles.about}>{sanitize(portfolio.about)}</p>
        </div>
      )}

      {/* Skills */}
      {portfolio.skills?.length > 0 && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>🛠️ Skills</h2>
          <div className={styles.skills}>
            {portfolio.skills.map((skill, i) => (
              <span key={i} className={styles.skill}>
                {sanitize(skill)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {portfolio.experience?.length > 0 && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>💼 Experience</h2>
          {portfolio.experience.map((exp, i) => (
            <div key={i} className={styles.experienceItem}>
              <p className={styles.expRole}>{sanitize(exp.role)}</p>
              <p className={styles.expCompany}>{sanitize(exp.company)}</p>
              <p className={styles.expDates}>
                {sanitize(exp.from)} — {sanitize(exp.to)}
              </p>
              {exp.description && (
                <p className={styles.expDesc}>{sanitize(exp.description)}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {portfolio.education?.length > 0 && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>🎓 Education</h2>
          {portfolio.education.map((edu, i) => (
            <div key={i} className={styles.educationItem}>
              <p className={styles.eduDegree}>{sanitize(edu.degree)}</p>
              <p className={styles.eduInstitution}>
                {sanitize(edu.institution)}
              </p>
              <p className={styles.eduYear}>{sanitize(edu.year)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Contact */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>🔗 Contact</h2>
        <div className={styles.contactLinks}>
          {portfolio.contact_email && (
            <a
              href={`mailto:${sanitize(portfolio.contact_email)}`}
              className={styles.contactLink}
            >
              ✉️ {sanitize(portfolio.contact_email)}
            </a>
          )}
          {portfolio.linkedin_url && (
            <a
              href={sanitize(portfolio.linkedin_url)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactLink}
            >
              💼 LinkedIn
            </a>
          )}
          {portfolio.github_url && (
            <a
              href={sanitize(portfolio.github_url)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactLink}
            >
              🐙 GitHub
            </a>
          )}
          {portfolio.twitter_url && (
            <a
              href={sanitize(portfolio.twitter_url)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactLink}
            >
              🐦 Twitter
            </a>
          )}
        </div>
      </div>
    </>
  );
}

/* ============================================= */
/*  Business portfolio sections                   */
/* ============================================= */
function BusinessView({ portfolio }) {
  return (
    <>
      {/* Description */}
      {portfolio.description && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>📝 About Us</h2>
          <p className={styles.description}>
            {sanitize(portfolio.description)}
          </p>
        </div>
      )}

      {/* Services */}
      {portfolio.services?.length > 0 && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>🛎️ Services</h2>
          <div className={styles.servicesGrid}>
            {portfolio.services.map((svc, i) => (
              <div key={i} className={styles.serviceCard}>
                <h3 className={styles.serviceName}>{sanitize(svc.name)}</h3>
                {svc.description && (
                  <p className={styles.serviceDesc}>
                    {sanitize(svc.description)}
                  </p>
                )}
                {svc.price && (
                  <p className={styles.servicePrice}>{sanitize(svc.price)}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Testimonials */}
      {portfolio.testimonials?.length > 0 && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>⭐ Testimonials</h2>
          {portfolio.testimonials.map((t, i) => (
            <div key={i} className={styles.testimonialItem}>
              <p className={styles.testimonialText}>
                &ldquo;{sanitize(t.text)}&rdquo;
              </p>
              <p className={styles.testimonialAuthor}>{sanitize(t.author)}</p>
              {t.role && (
                <p className={styles.testimonialRole}>{sanitize(t.role)}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Contact */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>📞 Contact</h2>
        <div className={styles.contactInfo}>
          {portfolio.contact_email && (
            <div className={styles.contactRow}>
              <span className={styles.contactLabel}>Email</span>
              <a href={`mailto:${sanitize(portfolio.contact_email)}`}>
                {sanitize(portfolio.contact_email)}
              </a>
            </div>
          )}
          {portfolio.phone && (
            <div className={styles.contactRow}>
              <span className={styles.contactLabel}>Phone</span>
              <span>{sanitize(portfolio.phone)}</span>
            </div>
          )}
          {portfolio.website && (
            <div className={styles.contactRow}>
              <span className={styles.contactLabel}>Website</span>
              <a
                href={sanitize(portfolio.website)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {sanitize(portfolio.website)}
              </a>
            </div>
          )}
          {portfolio.location && (
            <div className={styles.contactRow}>
              <span className={styles.contactLabel}>Location</span>
              <span>{sanitize(portfolio.location)}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
