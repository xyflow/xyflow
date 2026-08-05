import { useCallback, useRef } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';

/*
 * useSyncExternalStore over a notify-only channel: `subscribe` registers on the channel, `compute`
 * rebuilds the snapshot when notified, and `isEqual` dedups against the cached snapshot so an
 * unchanged result keeps a stable reference (the consumer does not re-render). Used by the node/edge
 * id-list hooks and SelectionListener, which all recompute a derived value on a coarse
 * "something in this category changed" signal instead of a global store selector.
 */
export function useExternalSnapshot<T>(
  subscribe: (onChange: () => void) => () => void,
  compute: () => T,
  isEqual: (a: T, b: T) => boolean
): T {
  const cache = useRef<T | null>(null);

  const getSnapshot = useCallback(() => {
    const next = compute();
    if (cache.current !== null && isEqual(cache.current, next)) {
      return cache.current;
    }
    cache.current = next;
    return next;
  }, [compute, isEqual]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
