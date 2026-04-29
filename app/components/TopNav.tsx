import Link from "next/link";
import styles from "./TopNav.module.css";

export default function TopNav() {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.lockup}>
        <span className={styles.orb} aria-hidden="true" />
        <span className={styles.wordmark}>Prometheus</span>
      </Link>
    </nav>
  );
}
