import { useState, useEffect } from 'react';

import { isInputDOMNode } from '../utils';

export default (keyCode: number) => {
  const [keyPressed, setKeyPressed] = useState(false);

  function downHandler(evt: KeyboardEvent) {
    if (evt.keyCode === keyCode && !isInputDOMNode(evt)) {
      setKeyPressed(true);
    }
  }

  const upHandler = (evt: KeyboardEvent) => {
    if (evt.keyCode === keyCode && !isInputDOMNode(evt)) {
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
