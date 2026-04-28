"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./TopNav.module.css";

interface TopNavProps {
  showSignIn?: boolean;
  onSignIn?: () => void;
}

interface Session {
  email: string;
}

export default function TopNav({ showSignIn = true, onSignIn }: TopNavProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setSession(data.session ?? null);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSignOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    setSession(null);
    setMenuOpen(false);
  }

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

        {loaded && session ? (
          <div className={styles.account}>
            <button
              className={styles.accountBtn}
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <span className={styles.accountEmail}>{session.email}</span>
              <span className={styles.accountCaret} aria-hidden="true">▾</span>
            </button>
            {menuOpen && (
              <div className={styles.menu} role="menu">
                <button
                  className={styles.menuItem}
                  onClick={handleSignOut}
                  role="menuitem"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          loaded && showSignIn && (
            onSignIn ? (
              <button className={styles.signIn} onClick={onSignIn}>
                Sign in
              </button>
            ) : (
              <Link href="/sign-in" className={styles.signIn}>
                Sign in
              </Link>
            )
          )
        )}
      </div>
    </nav>
  );
}
