"use client";

import Link from "next/link";
import { useState } from "react";
import TopNav from "./TopNav";
import styles from "./PlaceholderWorkflow.module.css";

interface Props {
  num: string;
  title: string;
  description: string;
}

export default function PlaceholderWorkflow({ num, title, description }: Props) {
  const [notified, setNotified] = useState(false);
  const [email, setEmail] = useState("");

  function handleNotify(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) setNotified(true);
  }

  return (
    <div className={styles.page}>
      <TopNav />
      <div className={styles.content}>
        <span className={styles.bigNum}>{num}</span>
        <span className="eyebrow">Coming soon</span>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.desc}>{description}</p>

        <div className={styles.placeholder}>
          [ TOOL UI — COMING SOON ]
        </div>

        {!notified ? (
          <form className={styles.notifyForm} onSubmit={handleNotify}>
            <p className={styles.notifyLabel}>
              Want to know when it launches?
            </p>
            <div className={styles.notifyRow}>
              <input
                type="email"
                className={styles.emailInput}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className={styles.notifyBtn}>
                Notify me when ready
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.notifyConfirm}>
            <span className="eyebrow">You're on the list.</span>
            <p>We'll email you when {title} launches.</p>
          </div>
        )}

        <Link href="/" className={styles.back}>
          ← Back to all tools
        </Link>
      </div>
    </div>
  );
}
