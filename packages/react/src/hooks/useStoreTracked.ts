import { useCallback, useDebugValue, useMemo, useSyncExternalStore } from 'react';
import type { ExtractState } from 'zustand';

import type { MiddlewareStoreApi } from '../store/middleware';

type ReadonlyTrackedStoreApi<T> = Pick<MiddlewareStoreApi<T>, 'getState' | 'getInitialState' | 'subscribeTracked'>;

const identity = <T>(state: T): T => state;

export function useStoreTracked<S extends ReadonlyTrackedStoreApi<unknown>>(api: S): ExtractState<S>;
export function useStoreTracked<S extends ReadonlyTrackedStoreApi<unknown>, U>(
  api: S,
  selector: (state: ExtractState<S>) => U
): U;
export function useStoreTracked<TState, StateSlice>(
  api: ReadonlyTrackedStoreApi<TState>,
  selector: (state: TState) => StateSlice | TState = identity
) {
  const { subscribe, getState } = useMemo(() => api.subscribeTracked(), [api, selector]);
  const slice = useSyncExternalStore(
    subscribe,
    useCallback(() => selector(getState()), [selector, getState]),
    useCallback(() => selector(api.getInitialState()), [api, selector])
  );

  useDebugValue(slice);
  return slice;
}
