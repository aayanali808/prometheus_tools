"use client";

import { useRouter } from "next/navigation";
import styles from "./HomeCards.module.css";

const TOOLS = [
  {
    num: "01",
    title: "Rank Buddy",
    titleEm: "— Assessing your SEO and AIO",
    blurb:
      "Paste a URL. Rank Buddy audits how search engines and AI assistants see your site, then ships a strict, evidence-only report.",
    status: "live" as const,
    href: "/tools/rank-buddy",
  },
  {
    num: "02",
    title: "Workflow Two",
    titleEm: "",
    blurb:
      "Coming soon. The second AI workflow your customers will use. Same shell as Rank Buddy when content arrives.",
    status: "soon" as const,
    href: "/tools/workflow-two",
  },
  {
    num: "03",
    title: "Workflow Three",
    titleEm: "",
    blurb:
      "Coming soon. The third AI workflow your customers will use. Same shell as Rank Buddy when content arrives.",
    status: "soon" as const,
    href: "/tools/workflow-three",
  },
];

export default function HomeCards() {
  const router = useRouter();

  function handleClick(href: string) {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        router.push(href);
      });
    } else {
      router.push(href);
    }
  }

  return (
    <div className={styles.cards}>
      <div className={styles.inner}>
        {TOOLS.map((tool) => (
          <button
            key={tool.num}
            className={`${styles.card} ${tool.status === "live" ? styles.live : styles.soon}`}
            onClick={() => handleClick(tool.href)}
            aria-label={`Open ${tool.title}`}
          >
            <span className={styles.num}>{tool.num}</span>
            <div className={styles.body}>
              <span className="eyebrow">
                {tool.status === "live" ? "Available" : "Coming soon"}
              </span>
              <h2 className={styles.cardTitle}>
                {tool.title}
                {tool.titleEm && (
                  <em className={styles.titleEm}>{tool.titleEm}</em>
                )}
              </h2>
              <p className={styles.blurb}>{tool.blurb}</p>
            </div>
            <span className={styles.openTag}>Open →</span>
          </button>
        ))}
      </div>
    </div>
  );
}
