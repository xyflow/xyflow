import { useState, useEffect, useRef, useMemo } from 'react';

import { isInputDOMNode } from '../utils';
import type { KeyCode } from '../types';

type Keys = Array<string>;
type PressedKeys = Set<string>;
type KeyOrCode = 'key' | 'code';
export interface UseKeyPressOptions {
  target: Window | Document | HTMLElement | ShadowRoot | null;
}

const doc = typeof document !== 'undefined' ? document : null;

// the keycode can be a string 'a' or an array of strings ['a', 'a+d']
// a string means a single key 'a' or a combination when '+' is used 'a+d'
// an array means different possibilites. Explainer: ['a', 'd+s'] here the
// user can use the single key 'a' or the combination 'd' + 's'
export default (keyCode: KeyCode | null = null, options: UseKeyPressOptions = { target: doc }): boolean => {
  const [keyPressed, setKeyPressed] = useState(false);

  // we need to remember the pressed keys in order to support combinations
  const pressedKeys = useRef<PressedKeys>(new Set([]));

  // keyCodes = array with single keys [['a']] or key combinations [['a', 's']]
  // keysToWatch = array with all keys flattened ['a', 'd', 'ShiftLeft']
  // used to check if we store event.code or event.key. When the code is in the list of keysToWatch
  // we use the code otherwise the key. Explainer: When you press the left "command" key, the code is "MetaLeft"
  // and the key is "Meta". We want users to be able to pass keys and codes so we assume that the key is meant when
  // we can't find it in the list of keysToWatch.
  const [keyCodes, keysToWatch] = useMemo<[Array<Keys>, Keys]>(() => {
    if (keyCode !== null) {
      const keyCodeArr = Array.isArray(keyCode) ? keyCode : [keyCode];
      const keys = keyCodeArr.filter((kc) => typeof kc === 'string').map((kc) => kc.split('+'));
      const keysFlat = keys.reduce((res: Keys, item) => res.concat(...item), []);

      return [keys, keysFlat];
    }

    return [[], []];
  }, [keyCode]);

  useEffect(() => {
    if (keyCode !== null) {
      const downHandler = (event: KeyboardEvent) => {
        if (isInputDOMNode(event)) {
          return false;
        }
        const keyOrCode = useKeyOrCode(event.code, keysToWatch);
        pressedKeys.current.add(event[keyOrCode]);

        if (isMatchingKey(keyCodes, pressedKeys.current, false)) {
          event.preventDefault();
          setKeyPressed(true);
        }
      };

      const upHandler = (event: KeyboardEvent) => {
        if (isInputDOMNode(event)) {
          return false;
        }
        const keyOrCode = useKeyOrCode(event.code, keysToWatch);

        if (isMatchingKey(keyCodes, pressedKeys.current, true)) {
          setKeyPressed(false);
          pressedKeys.current.clear();
        } else {
          pressedKeys.current.delete(event[keyOrCode]);
        }
      };

      const resetHandler = () => {
        pressedKeys.current.clear();
        setKeyPressed(false);
      };

      options?.target?.addEventListener('keydown', downHandler as EventListenerOrEventListenerObject);
      options?.target?.addEventListener('keyup', upHandler as EventListenerOrEventListenerObject);
      window.addEventListener('blur', resetHandler);

      return () => {
        options?.target?.removeEventListener('keydown', downHandler as EventListenerOrEventListenerObject);
        options?.target?.removeEventListener('keyup', upHandler as EventListenerOrEventListenerObject);
        window.removeEventListener('blur', resetHandler);
      };
    }
  }, [keyCode, setKeyPressed]);

  return keyPressed;
};

// utils

function isMatchingKey(keyCodes: Array<Keys>, pressedKeys: PressedKeys, isUp: boolean): boolean {
  return (
    keyCodes
      // we only want to compare same sizes of keyCode definitions
      // and pressed keys. When the user specified 'Meta' as a key somewhere
      // this would also be truthy without this filter when user presses 'Meta' + 'r'
      .filter((keys) => isUp || keys.length === pressedKeys.size)
      // since we want to support multiple possibilities only one of the
      // combinations need to be part of the pressed keys
      .some((keys) => keys.every((k) => pressedKeys.has(k)))
  );
}

function useKeyOrCode(eventCode: string, keysToWatch: KeyCode): KeyOrCode {
  return keysToWatch.includes(eventCode) ? 'code' : 'key';
}
