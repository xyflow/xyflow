import { useRef } from 'react';

/**
 * Wraps a selector and reuses its previous result when the equality function
 * considers the next result equal. This is useful when migrating custom
 * selectors that need to preserve referential stability.
 */
export function useEqualSelector<S, U>(
  selector: (state: S) => U,
  isEqual: (a: U, b: U) => boolean,
): (state: S) => U {
  const prev = useRef<U>(undefined as U);
  const hasPrev = useRef(false);

  return (state) => {
    const next = selector(state);

    if (hasPrev.current && isEqual(prev.current, next)) {
      return prev.current;
    }

    prev.current = next;
    hasPrev.current = true;
    return next;
  };
}
