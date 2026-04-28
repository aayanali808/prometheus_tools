"use client";

import { useState } from "react";
import styles from "./SignInModal.module.css";

interface Props {
  onClose: () => void;
}

export default function SignInModal({ onClose }: Props) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/request-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Could not send the link. Try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setSending(false);
    }
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
              We sent a sign-in link to <strong>{email}</strong>. It expires in
              15 minutes. You can close this window and click the link from
              your email.
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
                disabled={sending}
                autoFocus
                required
              />
              {error && <div className={styles.error}>{error}</div>}
              <button type="submit" className={styles.primaryBtn} disabled={sending}>
                {sending ? "Sending…" : "Send magic link →"}
              </button>
              <button
                type="button"
                className={styles.skipBtn}
                onClick={onClose}
                disabled={sending}
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
