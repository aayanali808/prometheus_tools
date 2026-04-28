import styles from "./MessageQuestion.module.css";

interface Props {
  text: string;
}

export default function MessageQuestion({ text }: Props) {
  return (
    <div className={styles.wrap}>
      <span className="eyebrow">Rank Buddy</span>
      <p className={styles.question}>{text}</p>
    </div>
  );
}
