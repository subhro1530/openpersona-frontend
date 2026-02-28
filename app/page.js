import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import styles from "./landing.module.css";

/**
 * Landing page — public home with hero, features, and CTA.
 * This is a server component (no 'use client').
 */
export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.badge}>✨ Build Your Online Presence</span>
          <h1 className={styles.title}>
            Create <span className={styles.highlight}>Stunning Portfolios</span>{" "}
            in Minutes
          </h1>
          <p className={styles.subtitle}>
            OpenPersona helps you craft beautiful personal and business
            portfolios with zero coding. Pick a theme, fill in your details, and
            share your unique link with the world.
          </p>
          <div className={styles.ctas}>
            <Link href={ROUTES.REGISTER} className={styles.ctaPrimary}>
              Get Started — Free
            </Link>
            <Link href={ROUTES.LOGIN} className={styles.ctaSecondary}>
              Sign In
            </Link>
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
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎨</div>
              <h3 className={styles.featureTitle}>Beautiful Themes</h3>
              <p className={styles.featureDesc}>
                Choose from curated themes for personal and business portfolios,
                each designed for maximum impact.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⚡</div>
              <h3 className={styles.featureTitle}>Lightning Fast</h3>
              <p className={styles.featureDesc}>
                Create and publish your portfolio in under 5 minutes. No complex
                setup, no coding required.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔗</div>
              <h3 className={styles.featureTitle}>Shareable Link</h3>
              <p className={styles.featureDesc}>
                Get a unique, SEO-friendly public URL for your portfolio. Share
                it on social media, resumes, or business cards.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📱</div>
              <h3 className={styles.featureTitle}>Responsive Design</h3>
              <p className={styles.featureDesc}>
                Every portfolio looks great on desktop, tablet, and mobile
                devices right out of the box.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🛡️</div>
              <h3 className={styles.featureTitle}>Secure & Private</h3>
              <p className={styles.featureDesc}>
                Your data is safe with industry-standard encryption. Only you
                control what the world sees.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🏢</div>
              <h3 className={styles.featureTitle}>Personal & Business</h3>
              <p className={styles.featureDesc}>
                Whether you&apos;re a freelancer or a company, we have dedicated
                portfolio types tailored to your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={styles.ctaBanner}>
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
