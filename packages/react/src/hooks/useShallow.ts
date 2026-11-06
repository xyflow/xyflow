import { useRef } from 'react';

// Based on Zustand v4.5.2's MIT-licensed shallow comparator:
// https://github.com/pmndrs/zustand/blob/v4.5.2/src/vanilla/shallow.ts
// Compare object keys directly to avoid allocating Maps for selector results.
function shallow<T>(objA: T, objB: T): boolean {
  if (Object.is(objA, objB)) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  if (objA instanceof Map && objB instanceof Map) {
    if (objA.size !== objB.size) return false;

    for (const [key, value] of objA) {
      if (!objB.has(key) || !Object.is(value, objB.get(key))) {
        return false;
      }
    }
    return true;
  }

  if (objA instanceof Set && objB instanceof Set) {
    if (objA.size !== objB.size) return false;

    for (const value of objA) {
      if (!objB.has(value)) {
        return false;
      }
    }
    return true;
  }

  const keysA = Object.keys(objA);
  if (keysA.length !== Object.keys(objB).length) {
    return false;
  }

  for (const keyA of keysA) {
    if (!Object.prototype.hasOwnProperty.call(objB, keyA) || !Object.is(objA[keyA as keyof T], objB[keyA as keyof T])) {
      return false;
    }
  }
  return true;
}

/** Wraps a selector to reuse its previous result when it is shallowly equal. */
export function useShallow<S, U>(selector: (state: S) => U): (state: S) => U {
  const prev = useRef<U | undefined>(undefined);

  return (state) => {
    const next = selector(state);
    return shallow(prev.current, next) ? (prev.current as U) : (prev.current = next);
  };
}
