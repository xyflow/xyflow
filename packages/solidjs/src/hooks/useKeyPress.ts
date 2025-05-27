// import { useState, useEffect, useRef, useMemo } from 'react';
import { isInputDOMNode, type KeyCode } from '@xyflow/system';
import { useRef } from '../utils/hooks';
import { createEffect, createSignal, onCleanup } from 'solid-js';

type Keys = Array<string>;
type PressedKeys = Set<string>;
type KeyOrCode = 'key' | 'code';

export type UseKeyPressOptions = {
  target?: Window | Document | HTMLElement | ShadowRoot | null;
  actInsideInputWithModifier?: boolean;
};

const defaultDoc = typeof document !== 'undefined' ? document : null;

/**
 * Hook for handling key events.
 *
 * @public
 * @param param.keyCode - The key code (string or array of strings) to use
 * @param param.options - Options
 * @returns boolean
 */
export function useKeyPress(
  // the keycode can be a string 'a' or an array of strings ['a', 'a+d']
  // a string means a single key 'a' or a combination when '+' is used 'a+d'
  // an array means different possibilites. Explainer: ['a', 'd+s'] here the
  // user can use the single key 'a' or the combination 'd' + 's'
  keyCode: (() => KeyCode | null | undefined) | null = null,
  options: () => UseKeyPressOptions = () => ({ target: defaultDoc, actInsideInputWithModifier: true })
): () => boolean {
  const [keyPressed, setKeyPressed] = createSignal(false);

  // we need to remember if a modifier key is pressed in order to track it
  const modifierPressed = useRef(false);

  // we need to remember the pressed keys in order to support combinations
  const pressedKeys = useRef<PressedKeys>(new Set([]));

  // keyCodes = array with single keys [['a']] or key combinations [['a', 's']]
  // keysToWatch = array with all keys flattened ['a', 'd', 'ShiftLeft']
  // used to check if we store event.code or event.key. When the code is in the list of keysToWatch
  // we use the code otherwise the key. Explainer: When you press the left "command" key, the code is "MetaLeft"
  // and the key is "Meta". We want users to be able to pass keys and codes so we assume that the key is meant when
  // we can't find it in the list of keysToWatch.
  const keyStuff = (): [string[][], string[]] => {
    const keyCodeValue = keyCode?.() ?? null;

    if (keyCodeValue !== null) {
      const keyCodeArr = Array.isArray(keyCodeValue) ? keyCodeValue : [keyCodeValue];
      const keys = keyCodeArr.filter((kc) => typeof kc === 'string').map((kc) => kc!.split('+'));
      const keysFlat = keys.reduce((res: Keys, item) => res.concat(...item), []);

      return [keys, keysFlat];
    }

    return [[], []] as [string[][], string[]]
  };


  createEffect(() => {

    const keyCodes = () => keyStuff()[0];
    const keysToWatch = () => keyStuff()[1];
    
    const target = options()?.target || defaultDoc;
    const keyCodeValue = keyCode?.() ?? null;

    if (keyCodeValue !== null) {
      const downHandler = (event: KeyboardEvent) => {
        modifierPressed.current = event.ctrlKey || event.metaKey || event.shiftKey;
        const preventAction =
          (!modifierPressed.current || (modifierPressed.current && !options().actInsideInputWithModifier)) &&
          isInputDOMNode(event);

        if (preventAction) {
          return false;
        }
        const keyOrCode = useKeyOrCode(event.code, keysToWatch());
        pressedKeys.current.add(event[keyOrCode]);

        if (isMatchingKey(keyCodes(), pressedKeys.current, false)) {
          event.preventDefault();
          setKeyPressed(true);
        }
      };

      const upHandler = (event: KeyboardEvent) => {
        const preventAction =
          (!modifierPressed.current || (modifierPressed.current && !options().actInsideInputWithModifier)) &&
          isInputDOMNode(event);

        if (preventAction) {
          return false;
        }
        const keyOrCode = useKeyOrCode(event.code, keysToWatch());

        if (isMatchingKey(keyCodes(), pressedKeys.current, true)) {
          setKeyPressed(false);
          pressedKeys.current.clear();
        } else {
          pressedKeys.current.delete(event[keyOrCode]);
        }

        // fix for Mac: when cmd key is pressed, keyup is not triggered for any other key, see: https://stackoverflow.com/questions/27380018/when-cmd-key-is-kept-pressed-keyup-is-not-triggered-for-any-other-key
        if (event.key === 'Meta') {
          pressedKeys.current.clear();
        }

        modifierPressed.current = false;
      };

      const resetHandler = () => {
        pressedKeys.current.clear();
        setKeyPressed(false);
      };

      target?.addEventListener('keydown', downHandler as EventListenerOrEventListenerObject);
      target?.addEventListener('keyup', upHandler as EventListenerOrEventListenerObject);
      window.addEventListener('blur', resetHandler);
      window.addEventListener('contextmenu', resetHandler);

      onCleanup(() => {
        target?.removeEventListener('keydown', downHandler as EventListenerOrEventListenerObject);
        target?.removeEventListener('keyup', upHandler as EventListenerOrEventListenerObject);
        window.removeEventListener('blur', resetHandler);
        window.removeEventListener('contextmenu', resetHandler);
      });
    }
  });

  return keyPressed;
}

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
