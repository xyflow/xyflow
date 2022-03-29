import { useCallback, useMemo, useState } from 'react';

import { KeyCode } from '../types';
import { useHotkeys } from "react-hotkeys-hook";

// the keycode can be a string 'a' or an array of strings ['a', 'd']
// a string means a single key 'a' or 'Meta'
// an array means different possibilities. Explainer: ['a', 'Shift'] here the
// user can use the single key 'a' or the 'Shift' key or both to set the state to true.
// If any of te pressed keys are released, te stat will return to false again, even if on of the keys is still held.
// for combination hotkeys, like 'ctrl+a' use useHotkeys with a callback instead.
export default (keyCode: KeyCode | null = null): boolean => {
  const [keyPressed, setKeyPressed] = useState(false);
  const keyCodes = useMemo(() => Array.isArray(keyCode) ? keyCode : [keyCode || ''], [keyCode]);
  const singles = useMemo(() => keyCodes.filter(k => !k.includes('+') || k === '+'), [keyCodes]);

  const handleSingleKeyEvent = useCallback((e: KeyboardEvent, isDown: boolean) => {
    if (singles.includes(e.code) || singles.includes(e.key)) {
      e.preventDefault();
      setKeyPressed(isDown);
    }
  },[singles, setKeyPressed]);

  useHotkeys('*', (e) => handleSingleKeyEvent(e, true), {keydown: true});
  useHotkeys('*', (e) => handleSingleKeyEvent(e, false), {keyup: true});

  return keyPressed;
};
