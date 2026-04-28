import styles from "./MessageUser.module.css";

interface Props {
  text: string;
}

export default function MessageUser({ text }: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.bubble}>{text}</div>
    </div>
  );
}
