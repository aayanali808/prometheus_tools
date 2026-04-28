import styles from "./MessageScore.module.css";
import { ScoreMessage } from "./types";

interface Props {
  message: ScoreMessage;
  onRunAIO?: () => void;
  onGeneratePDF?: () => void;
  showActions?: boolean;
}

export default function MessageScore({ message, onRunAIO, onGeneratePDF, showActions }: Props) {
  const isSEO = message.scoreType === "SEO";

  const doingWell = message.doing_well ?? message.visible_to_ai ?? [];
  const needsWork = message.needs_work ?? message.invisible_to_ai ?? [];
  const fixes = message.top_fixes ?? message.top_actions ?? [];

  return (
    <div className={styles.wrap}>
      <span className="eyebrow">Rank Buddy</span>
      <div className={styles.card}>
        <div className={styles.scoreBlock}>
          <span className="eyebrow">{message.scoreType} Score</span>
          <div className={styles.numeral}>
            {message.score}
            <span className={styles.outOf}>/100</span>
          </div>
        </div>
        <div className={styles.detail}>
          {doingWell.length > 0 && (
            <div className={styles.section}>
              <span className={styles.sectionLabel}>Doing well</span>
              <ul className={styles.list}>
                {doingWell.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {needsWork.length > 0 && (
            <div className={styles.section}>
              <span className={styles.sectionLabel}>Needs work</span>
              <ul className={styles.list}>
                {needsWork.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {fixes.length > 0 && (
            <div className={styles.section}>
              <span className={styles.sectionLabel}>Top {fixes.length} fixes</span>
              <ol className={styles.list}>
                {fixes.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ol>
            </div>
          )}
          {message.blunt_insight && (
            <div className={styles.insight}>"{message.blunt_insight}"</div>
          )}
        </div>
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
              Generate PDF
            </button>
          )}
        </div>
      )}
    </div>
  );
}
