import { Suspense } from "react";
import TopNav from "@/components/TopNav";
import SignInForm from "./SignInForm";
import styles from "./page.module.css";

export const metadata = {
  title: "Sign in — Prometheus Tools",
};

export default function SignInPage() {
  return (
    <div className={styles.page}>
      <TopNav showSignIn={false} />
      <div className={styles.center}>
        <div className={styles.card}>
          <Suspense fallback={<span className="eyebrow">Loading…</span>}>
            <SignInForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
