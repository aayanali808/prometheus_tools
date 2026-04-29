import styles from "./MessageTrace.module.css";

interface Props {
  lines: string[];
}

export default function MessageTrace({ lines }: Props) {
  const text = lines.join(" · ");
  if (!text.trim()) return null;
  return (
    <div className={styles.wrap}>
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.label}>{text}</span>
    </div>
  );
}
