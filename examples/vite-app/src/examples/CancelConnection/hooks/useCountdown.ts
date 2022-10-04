import { useRef, useState } from 'react';

const useCountdown = (callback: () => void) => {
  const interval = useRef<NodeJS.Timer>();
  const [remaining, setRemaining] = useState(0);

  const start = (duration: number) => {
    setRemaining(duration);

    interval.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev === 1) {
          clearInterval(interval.current);
          callback();
        }

        return prev - 1;
      });
    }, 1000);
  };

  const stop = () => {
    clearInterval(interval.current);
    setRemaining(0);
  };

  return {
    start,
    remaining,
    stop,
    counting: remaining > 0,
  };
};

export default useCountdown;
