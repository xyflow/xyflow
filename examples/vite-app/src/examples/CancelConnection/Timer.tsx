import cc from 'classcat';
import styles from './Timer.module.css';

interface Props {
  duration: number;
  remaining: number;
  show: boolean;
}

export default function Timer({
  duration,
  remaining,
  show,
}: Props) {
  const percentage = 100 - (remaining / duration) * 100;

  return (
    <div className={cc({
      [styles.Timer]: true,
      [styles.show]: show,
    })}>
      <div className={styles.progress} style={{
        width: `${percentage}%`,
      }} />
      Connection will be canceled in {remaining} seconds
    </div>
  )
}