import styles from "./MessageAnswer.module.css";

interface Props {
  text: string;
}

export default function MessageAnswer({ text }: Props) {
  const paragraphs = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className={styles.wrap}>
      <span className="eyebrow">Rank Buddy</span>
      <div className={styles.body}>
        {paragraphs.length > 0 ? (
          paragraphs.map((p, i) => <p key={i} className={styles.para}>{p}</p>)
        ) : (
          <p className={styles.para}>{text}</p>
        )}
      </div>
    </div>
  );
}
