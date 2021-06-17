import { useState, useEffect } from 'react';

import { isInputDOMNode } from '../utils';
import { KeyCode } from '../types';

export default (...keyCodes: KeyCode[]): boolean => {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    if (typeof keyCodes !== 'undefined' && keyCodes.length > 0) {
      const downHandler = (event: KeyboardEvent) => {
        if (!isInputDOMNode(event) && (keyCodes.indexOf(event.key) != -1 || keyCodes.indexOf(event.keyCode) != -1)) {
          event.preventDefault();

          setKeyPressed(true);
        }
      };

      const upHandler = (event: KeyboardEvent) => {
        if (!isInputDOMNode(event) && (keyCodes.indexOf(event.key) != -1 || keyCodes.indexOf(event.keyCode) != -1)) {
          setKeyPressed(false);
        }
      };

      const resetHandler = () => setKeyPressed(false);

      window.addEventListener('keydown', downHandler);
      window.addEventListener('keyup', upHandler);
      window.addEventListener('blur', resetHandler);

      return () => {
        window.removeEventListener('keydown', downHandler);
        window.removeEventListener('keyup', upHandler);
        window.removeEventListener('blur', resetHandler);
      };
    }
  }, [keyCodes, setKeyPressed]);

  return keyPressed;
};
