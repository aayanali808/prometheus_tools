import styles from "./MessageTrace.module.css";

interface Props {
  lines: string[];
}

export default function MessageTrace({ lines }: Props) {
  return (
    <div className={styles.wrap}>
      <span className="eyebrow">Rank Buddy</span>
      <div className={styles.trace}>
        {lines.map((line, i) => {
          const isActive = line.includes("scoring") || line.includes("analyzing");
          return (
            <div key={i} className={isActive ? styles.lineActive : styles.line}>
              {line}
            </div>
          );
        })}
      </div>
    </div>
  );
}
