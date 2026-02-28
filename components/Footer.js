/**
 * Footer — simple site footer.
 */

import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.brand}>OpenPersona</span>
        <p className={styles.copy}>
          © {year} OpenPersona. All rights reserved.
        </p>
        <ul className={styles.links}>
          <li>
            <a href="#" className={styles.link}>
              Privacy
            </a>
          </li>
          <li>
            <a href="#" className={styles.link}>
              Terms
            </a>
          </li>
          <li>
            <a href="#" className={styles.link}>
              Contact
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
