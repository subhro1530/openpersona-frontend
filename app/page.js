import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import styles from "./landing.module.css";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGrid} />
        <div className={styles.heroGlow} />
        <div className={styles.heroInner}>
          <span className={styles.badge}>
            &#x2728; Build Your Online Presence
          </span>
          <h1 className={styles.title}>
            Build Your Portfolio
            <br />
            <span className={styles.highlight}>in Minutes</span>
          </h1>
          <p className={styles.subtitle}>
            OpenPersona helps you craft beautiful personal and business
            portfolios with zero coding. Pick a theme, fill in your details, and
            share your unique link with the world.
          </p>
          <div className={styles.ctas}>
            <Link href={ROUTES.REGISTER} className={styles.ctaPrimary}>
              Get Started &mdash; Free
            </Link>
            <Link href={ROUTES.LOGIN} className={styles.ctaSecondary}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.stats}>
        <div className={styles.statsInner}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>10K+</span>
            <span className={styles.statLabel}>Portfolios Created</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNumber}>50+</span>
            <span className={styles.statLabel}>Beautiful Themes</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNumber}>99.9%</span>
            <span className={styles.statLabel}>Uptime</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className={styles.featuresInner}>
          <h2 className={styles.featuresTitle}>Why OpenPersona?</h2>
          <p className={styles.featuresSubtitle}>
            Everything you need to stand out, built right in.
          </p>

          <div className={styles.grid}>
            {[
              {
                icon: "🎨",
                title: "Beautiful Themes",
                desc: "Choose from curated themes for personal and business portfolios, each designed for maximum impact.",
              },
              {
                icon: "⚡",
                title: "Lightning Fast",
                desc: "Create and publish your portfolio in under 5 minutes. No complex setup, no coding required.",
              },
              {
                icon: "🔗",
                title: "Shareable Link",
                desc: "Get a unique, SEO-friendly public URL. Share it on social media, resumes, or business cards.",
              },
              {
                icon: "📱",
                title: "Responsive Design",
                desc: "Every portfolio looks great on desktop, tablet, and mobile devices right out of the box.",
              },
              {
                icon: "🛡️",
                title: "Secure & Private",
                desc: "Your data is safe with industry-standard encryption. Only you control what the world sees.",
              },
              {
                icon: "🏢",
                title: "Personal & Business",
                desc: "Whether you're a freelancer or a company, we have dedicated portfolio types for your needs.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className={styles.featureCard}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaBannerGlow} />
        <h2 className={styles.ctaBannerTitle}>
          Ready to build your portfolio?
        </h2>
        <p className={styles.ctaBannerDesc}>
          Join thousands of professionals showcasing their work with
          OpenPersona.
        </p>
        <Link href={ROUTES.REGISTER} className={styles.ctaPrimary}>
          Create Your Portfolio
        </Link>
      </section>
    </>
  );
}
