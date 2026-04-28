"use client";

import { useState } from "react";
import styles from "./SignInModal.module.css";

interface Props {
  onClose: () => void;
}

export default function SignInModal({ onClose }: Props) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <div className={styles.overlay} onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Save your audit">
        {submitted ? (
          <>
            <span className="eyebrow">Check your inbox</span>
            <h2 className={styles.title}>Magic link sent.</h2>
            <p className={styles.desc}>
              Click the link in your email to save this audit to your account.
            </p>
            <button className={styles.skipBtn} onClick={onClose}>
              Continue as guest
            </button>
          </>
        ) : (
          <>
            <span className="eyebrow">Optional</span>
            <h2 className={styles.title}>
              Save this audit to your{" "}
              <em className={styles.titleEm}>account.</em>
            </h2>
            <p className={styles.desc}>
              You can keep using Rank Buddy without signing in. Sign in to save
              reports and access them later.
            </p>
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                type="email"
                className={styles.emailInput}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
              <button type="submit" className={styles.primaryBtn}>
                Send magic link →
              </button>
              <button
                type="button"
                className={styles.skipBtn}
                onClick={onClose}
              >
                Skip — keep using as guest
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
