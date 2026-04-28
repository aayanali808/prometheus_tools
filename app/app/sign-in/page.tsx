"use client";

import { useState } from "react";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import styles from "./page.module.css";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <div className={styles.page}>
      <TopNav showSignIn={false} />
      <div className={styles.center}>
        <div className={styles.card}>
          {submitted ? (
            <>
              <span className="eyebrow">Check your inbox</span>
              <h1 className={styles.title}>Magic link sent.</h1>
              <p className={styles.desc}>
                Click the link in your email to sign in and save your reports.
              </p>
              <Link href="/tools/rank-buddy" className={styles.primaryBtn}>
                Continue to Rank Buddy →
              </Link>
            </>
          ) : (
            <>
              <span className="eyebrow">Sign in</span>
              <h1 className={styles.title}>
                Save your audits to your{" "}
                <em className={styles.titleEm}>account.</em>
              </h1>
              <p className={styles.desc}>
                Enter your email to receive a magic link. No password needed.
                Guest mode is always available — signing in just saves reports.
              </p>
              <form onSubmit={handleSubmit} className={styles.form}>
                <input
                  type="email"
                  className={styles.emailInput}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  required
                />
                <button type="submit" className={styles.primaryBtn}>
                  Send magic link →
                </button>
                <Link href="/tools/rank-buddy" className={styles.skipLink}>
                  Skip — continue as guest
                </Link>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
