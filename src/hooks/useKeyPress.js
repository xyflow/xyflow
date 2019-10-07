import { useState, useEffect } from 'react';

import { inInputDOMNode } from '../utils';

export default function useKeyPress(keyCode) {
  const [keyPressed, setKeyPressed] = useState(false);

  function downHandler(evt) {
    if (evt.keyCode === keyCode && !inInputDOMNode(evt.target)) {
      setKeyPressed(true);
    }
  }

  const upHandler = (evt) => {
    if (evt.keyCode === keyCode && !inInputDOMNode(evt.target)) {
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
