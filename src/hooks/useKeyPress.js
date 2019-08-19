import { useState, useEffect } from 'react';

import { isInputNode } from '../utils';

export default function useKeyPress(targetKey) {
  const [keyPressed, setKeyPressed] = useState(false);

  function downHandler({ key, target }) {
    if (key === targetKey && !isInputNode(target)) {
      setKeyPressed(true);
    }
  }

  const upHandler = ({ key, target }) => {
    if (key === targetKey && !isInputNode(target)) {
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
