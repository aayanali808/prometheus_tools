import { ScoreMessage, ScoreCategory } from "./chat/types";
import styles from "./PdfPreview.module.css";

interface Props {
  scores: ScoreMessage[];
  url: string | null;
}

function legacyCategories(s: ScoreMessage): ScoreCategory[] {
  const dw = s.doing_well ?? s.visible_to_ai ?? [];
  const nw = s.needs_work ?? s.invisible_to_ai ?? [];
  if (dw.length === 0 && nw.length === 0) return [];
  return [
    {
      name: s.scoreType === "SEO" ? "Findings" : "AI Visibility",
      score: s.score,
      max: 100,
      doing_well: dw,
      needs_work: nw,
    },
  ];
}

function ScoreSection({ s }: { s: ScoreMessage }) {
  const categories = s.categories ?? legacyCategories(s);

  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>{s.scoreType} Score</div>
      <div className={styles.bigScore}>
        {s.score}<span className={styles.denom}>/100</span>
      </div>
      {s.headline && <div className={styles.headline}>{s.headline}</div>}
      {categories.length > 0 && (
        <div className={styles.categories}>
          {categories.map((cat) => {
            const pct = Math.max(0, Math.min(100, (cat.score / cat.max) * 100));
            return (
              <div key={cat.name} className={styles.cat}>
                <div className={styles.catHead}>
                  <span className={styles.catName}>{cat.name}</span>
                  <span className={styles.catScore}>
                    {cat.score}<span className={styles.catMax}>/{cat.max}</span>
                  </span>
                </div>
                <div className={styles.bar}>
                  <span className={styles.barFill} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
      {s.top_fixes && s.top_fixes.length > 0 && (
        <>
          <div className={styles.subHead}>Top fixes</div>
          {s.top_fixes.slice(0, 3).map((fix, i) => (
            <div key={i} className={styles.fix}>
              {fix.priority ?? i + 1}. {fix.action}
            </div>
          ))}
        </>
      )}
      {s.blunt_insight && (
        <div className={styles.insight}>&ldquo;{s.blunt_insight}&rdquo;</div>
      )}
    </div>
  );
}

export default function PdfPreview({ scores, url }: Props) {
  let hostname: string | null = null;
  if (url) {
    try {
      hostname = new URL(url).hostname;
    } catch {
      hostname = url;
    }
  }
  const seo = scores.find((s) => s.scoreType === "SEO");
  const aio = scores.find((s) => s.scoreType === "AIO");

  return (
    <div className={styles.panel}>
      <span className="eyebrow">Report preview</span>
      <div className={styles.doc}>
        {hostname ? (
          <>
            <div className={styles.docTitle}>
              {hostname} — SEO {aio ? "& AIO " : ""}Audit
            </div>
            <div className={styles.divider} />
            <div className={styles.generatedBy}>
              Rank Buddy · Prometheus Tools
            </div>
            {seo && <ScoreSection s={seo} />}
            {aio && <ScoreSection s={aio} />}
            {!aio && seo && (
              <div className={styles.aioPlaceholder}>
                <div className={styles.sectionHead}>AIO Score</div>
                <div className={styles.pending}>— Pending analysis</div>
              </div>
            )}
          </>
        ) : (
          <div className={styles.empty}>
            Run an audit to see the report preview here.
          </div>
        )}
      </div>
    </div>
  );
}
