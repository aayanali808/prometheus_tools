import Link from "next/link";
import TopNav from "@/components/TopNav";
import styles from "./page.module.css";

export default function SavedReportPage({ params }: { params: { id: string } }) {
  return (
    <div className={styles.page}>
      <TopNav />
      <div className={styles.content}>
        <span className="eyebrow">Saved Report · {params.id}</span>
        <h1 className={styles.title}>Report not found.</h1>
        <p className={styles.desc}>
          This report may have expired (guest reports last 7 days) or doesn't
          exist. Sign in to access saved reports permanently.
        </p>
        <Link href="/tools/rank-buddy" className={styles.back}>
          Start a new audit →
        </Link>
      </div>
    </div>
  );
}
