import { useEffect, useRef, useState } from 'react';

export default function useCountdown(callback: () => void) {
  const interval = useRef<ReturnType<typeof setInterval>>();
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  const [remaining, setRemaining] = useState(0);
  useEffect(() => () => clearInterval(interval.current), []);
  const stop = () => {
    clearInterval(interval.current);
    setRemaining(0);
  };
  const start = (duration: number) => {
    clearInterval(interval.current);
    let seconds = duration;
    setRemaining(seconds);
    interval.current = setInterval(() => {
      seconds -= 1;
      setRemaining(seconds);
      if (seconds <= 0) {
        clearInterval(interval.current);
        callbackRef.current();
      }
    }, 1000);
  };
  return { start, stop, remaining, counting: remaining > 0 };
}
