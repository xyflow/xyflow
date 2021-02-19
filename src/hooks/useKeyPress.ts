import { useState, useEffect } from 'react';

import { isInputDOMNode } from '../utils';
import { KeyCode } from '../types';

function resolveKeyCode(keyCode: KeyCode | Array<KeyCode>, event: any) {

  if(Array.isArray(keyCode)) {
    return keyCode.includes(event.key) || keyCode.includes(event.keyCode)
  }
  return (event.key === keyCode || event.keyCode === keyCode);
}
export default (keyCode?: KeyCode | Array<KeyCode>): boolean => {
  const [keyPressed, setKeyPressed] = useState(false);
  useEffect(() => {
    if (typeof keyCode !== 'undefined') {
      const downHandler = (event: KeyboardEvent) => {
        
        if (!isInputDOMNode(event) && resolveKeyCode(keyCode, event)) {
          event.preventDefault();

          setKeyPressed(true);
        }
      };

      const upHandler = (event: KeyboardEvent) => {
        if (!isInputDOMNode(event) && resolveKeyCode(keyCode, event)) {
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
  }, [keyCode, setKeyPressed]);

  return keyPressed;
};
