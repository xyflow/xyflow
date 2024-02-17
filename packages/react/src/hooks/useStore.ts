import { useContext, useMemo } from 'react';
import { useStoreWithEqualityFn as useZustandStore } from 'zustand/traditional';
import { errorMessages } from '@xyflow/system';

import StoreContext from '../contexts/RFStoreContext';
import type { ReactFlowState } from '../types';

const zustandErrorMessage = errorMessages['error001']();

/**
 * Hook for accessing the internal store. Should only be used in rare cases.
 *
 * @public
 * @param selector
 * @param equalityFn
 * @returns The selected state slice
 */

function useStore<StateSlice = unknown>(
  selector: (state: ReactFlowState) => StateSlice,
  equalityFn?: (a: StateSlice, b: StateSlice) => boolean
) {
  const store = useContext(StoreContext);

  if (store === null) {
    throw new Error(zustandErrorMessage);
  }

  return useZustandStore(store, selector, equalityFn);
}

function useStoreApi() {
  const store = useContext(StoreContext);

  if (store === null) {
    throw new Error(zustandErrorMessage);
  }

  return useMemo(
    () => ({
      getState: store.getState,
      setState: store.setState,
      subscribe: store.subscribe,
      destroy: store.destroy,
    }),
    [store]
  );
}

export { useStore, useStoreApi };
