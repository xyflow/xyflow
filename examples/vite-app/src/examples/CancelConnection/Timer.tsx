import cc from 'classcat';
import styles from './Timer.module.css';

interface Props {
  remaining: number;
  show: boolean;
}

export default function Timer({
  remaining,
  show,
}: Props) {
  return (
    <div className={cc({
      [styles.Timer]: true,
      [styles.show]: show,
    })}>
      Connection will be canceled in {remaining} seconds
    </div>
  )
}