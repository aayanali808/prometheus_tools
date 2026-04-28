"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";

const ERROR_COPY: Record<string, string> = {
  invalid: "That link expired or has already been used. Request a new one below.",
  missing: "That sign-in URL was missing its token. Try again.",
};

export default function SignInForm() {
  const search = useSearchParams();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(() => {
    const code = search.get("error");
    return code && ERROR_COPY[code] ? ERROR_COPY[code] : null;
  });

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

  if (submitted) {
    return (
      <>
        <span className="eyebrow">Check your inbox</span>
        <h1 className={styles.title}>Magic link sent.</h1>
        <p className={styles.desc}>
          We emailed a sign-in link to <strong>{email}</strong>. The link
          expires in 15 minutes and can only be used once. You can close this
          tab and click the link from your email client.
        </p>
        <Link href="/tools/rank-buddy" className={styles.primaryBtn}>
          Continue to Rank Buddy →
        </Link>
      </>
    );
  }

  return (
    <>
      <span className="eyebrow">Sign in</span>
      <h1 className={styles.title}>
        Save your audits to your{" "}
        <em className={styles.titleEm}>account.</em>
      </h1>
      <p className={styles.desc}>
        Enter your email to receive a magic link. No password needed. Guest
        mode is always available — signing in just saves reports.
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
          disabled={sending}
        />
        {error && <div className={styles.error}>{error}</div>}
        <button type="submit" className={styles.primaryBtn} disabled={sending}>
          {sending ? "Sending…" : "Send magic link →"}
        </button>
        <Link href="/tools/rank-buddy" className={styles.skipLink}>
          Skip — continue as guest
        </Link>
      </form>
    </>
  );
}
