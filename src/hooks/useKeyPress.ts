import { useState, useEffect } from 'react';

import { isInputDOMNode } from '../utils';

export default (keyCode: number): boolean => {
  const [keyPressed, setKeyPressed] = useState(false);

  function downHandler(event: KeyboardEvent) {
    if (event.keyCode === keyCode && !isInputDOMNode(event)) {
      setKeyPressed(true);
    }
  }

  const upHandler = (event: KeyboardEvent) => {
    if (event.keyCode === keyCode && !isInputDOMNode(event)) {
      setKeyPressed(false);
    }
  };

  const resetHandler = () => {
    setKeyPressed(false);
  };

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    window.addEventListener('blur', resetHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
      window.removeEventListener('blur', resetHandler);
    };
  }, []);

  return keyPressed;
};
