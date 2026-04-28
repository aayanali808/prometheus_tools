import styles from "./MessageScore.module.css";
import { ScoreMessage, ScoreCategory, PrioritizedFix } from "./types";

interface Props {
  message: ScoreMessage;
  onRunAIO?: () => void;
  onGeneratePDF?: () => void;
  showActions?: boolean;
}

function legacyCategories(message: ScoreMessage): ScoreCategory[] {
  const doingWell = message.doing_well ?? message.visible_to_ai ?? [];
  const needsWork = message.needs_work ?? message.invisible_to_ai ?? [];
  if (doingWell.length === 0 && needsWork.length === 0) return [];
  return [
    {
      name: message.scoreType === "SEO" ? "Findings" : "AI Visibility",
      score: message.score,
      max: 100,
      doing_well: doingWell,
      needs_work: needsWork,
    },
  ];
}

function legacyFixes(message: ScoreMessage): PrioritizedFix[] {
  const list = message.top_fixes ?? [];
  if (list.length > 0 && typeof list[0] === "object") return list;
  const legacy = (message.top_fixes as unknown as string[]) ?? message.top_actions ?? [];
  return legacy.map((action, i) => ({ priority: i + 1, action }));
}

function impactDotCount(impact?: string): number {
  if (impact === "high") return 3;
  if (impact === "medium") return 2;
  return 1;
}

export default function MessageScore({ message, onRunAIO, onGeneratePDF, showActions }: Props) {
  const isSEO = message.scoreType === "SEO";
  const categories = message.categories ?? legacyCategories(message);
  const fixes = legacyFixes(message);

  return (
    <div className={styles.wrap}>
      <span className="eyebrow">Rank Buddy</span>
      <div className={styles.card}>
        <header className={styles.header}>
          <div className={styles.scoreBlock}>
            <span className={styles.scoreLabel}>{message.scoreType} Score</span>
            <div className={styles.numeral}>
              {message.score}
              <span className={styles.outOf}>/100</span>
            </div>
          </div>
          {message.headline && (
            <p className={styles.headline}>{message.headline}</p>
          )}
        </header>

        {categories.length > 0 && (
          <div className={styles.categories}>
            {categories.map((cat) => {
              const pct = Math.max(0, Math.min(100, (cat.score / cat.max) * 100));
              return (
                <div key={cat.name} className={styles.category}>
                  <div className={styles.categoryHead}>
                    <span className={styles.categoryName}>{cat.name}</span>
                    <span className={styles.categoryScore}>
                      {cat.score}<span className={styles.categoryMax}>/{cat.max}</span>
                    </span>
                  </div>
                  <div className={styles.bar}>
                    <span className={styles.barFill} style={{ width: `${pct}%` }} />
                  </div>
                  {(cat.doing_well?.length || cat.needs_work?.length) ? (
                    <div className={styles.categoryBody}>
                      {cat.doing_well && cat.doing_well.length > 0 && (
                        <div className={styles.findings}>
                          <span className={`${styles.findingsLabel} ${styles.good}`}>
                            Doing well
                          </span>
                          <ul className={styles.findingsList}>
                            {cat.doing_well.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {cat.needs_work && cat.needs_work.length > 0 && (
                        <div className={styles.findings}>
                          <span className={`${styles.findingsLabel} ${styles.bad}`}>
                            Needs work
                          </span>
                          <ul className={styles.findingsList}>
                            {cat.needs_work.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}

        {fixes.length > 0 && (
          <div className={styles.fixes}>
            <span className={styles.fixesLabel}>Top fixes, ranked</span>
            <ol className={styles.fixesList}>
              {fixes.map((fix, i) => (
                <li key={i} className={styles.fix}>
                  <span className={styles.fixNum}>{fix.priority ?? i + 1}</span>
                  <div className={styles.fixBody}>
                    <span className={styles.fixAction}>{fix.action}</span>
                    {fix.why && <span className={styles.fixWhy}>{fix.why}</span>}
                  </div>
                  {fix.impact && (
                    <span className={`${styles.fixImpact} ${styles[`impact_${fix.impact}`]}`}>
                      {Array.from({ length: impactDotCount(fix.impact) }).map((_, d) => (
                        <span key={d} className={styles.impactDot} />
                      ))}
                      <span className={styles.impactLabel}>{fix.impact}</span>
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}

        {message.blunt_insight && (
          <div className={styles.insight}>&ldquo;{message.blunt_insight}&rdquo;</div>
        )}
        {message.seo_aio_gap && (
          <div className={styles.gap}>
            <span className={styles.gapLabel}>SEO ↔ AIO gap</span>
            <span className={styles.gapText}>{message.seo_aio_gap}</span>
          </div>
        )}
      </div>

      {showActions && (
        <div className={styles.actions}>
          {isSEO && onRunAIO && (
            <button className={styles.btnPrimary} onClick={onRunAIO}>
              Run AIO analysis →
            </button>
          )}
          {onGeneratePDF && (
            <button className={styles.btnSecondary} onClick={onGeneratePDF}>
              Download report
            </button>
          )}
        </div>
      )}
    </div>
  );
}
