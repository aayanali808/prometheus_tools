"use client";

import Link from "next/link";
import styles from "./TopNav.module.css";

interface TopNavProps {
  showSignIn?: boolean;
  onSignIn?: () => void;
}

export default function TopNav({ showSignIn = true, onSignIn }: TopNavProps) {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.lockup}>
        <span className={styles.orb} aria-hidden="true" />
        <span className={styles.wordmark}>Prometheus</span>
      </Link>
      <div className={styles.right}>
        <Link href="/" className={styles.navLink}>Tools</Link>
        <span className={styles.navLinkMuted}>About</span>
        <span className={styles.navLinkMuted}>Contact</span>
        {showSignIn && (
          <button className={styles.signIn} onClick={onSignIn}>
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
}
