import { useState, useEffect } from 'react';

import { isInputNode } from '../utils';

export default function useKeyPress(keyCode) {
  const [keyPressed, setKeyPressed] = useState(false);

  function downHandler(evt) {
    console.log(keyCode, evt.keyCode);
    if (evt.keyCode === keyCode && !isInputNode(evt.target)) {
      setKeyPressed(true);
    }
  }

  const upHandler = (evt) => {
    if (evt.keyCode === keyCode && !isInputNode(evt.target)) {
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
