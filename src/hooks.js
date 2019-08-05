import { useState, useEffect } from 'react';

const isInput = target => ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.nodeName);

export function useKeyPress(targetKey) {
  const [keyPressed, setKeyPressed] = useState(false);

  function downHandler({ key, target }) {
    if (key === targetKey && !isInput(target)) {
      setKeyPressed(true);
    }
  }

  const upHandler = ({ key, target }) => {
    if (key === targetKey && !isInput(target)) {
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []);

  return keyPressed;
}