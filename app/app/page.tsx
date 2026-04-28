import TopNav from "@/components/TopNav";
import HomeCards from "@/components/HomeCards";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.page}>
      <TopNav />
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <span className="eyebrow">Prometheus · Tools</span>
          <h1 className={styles.headline}>
            AI workflows that actually{" "}
            <em className={styles.headlineEm}>do the work.</em>
          </h1>
          <p className={styles.sub}>
            Three small tools. Each one wraps a model, gives it a job, and
            stops. Pick one to begin.
          </p>
        </div>
      </div>
      <HomeCards />
    </div>
  );
}
