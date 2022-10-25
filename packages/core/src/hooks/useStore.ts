import { useContext, useMemo } from 'react';
import { useStore as useZustandStore } from 'zustand';
import type { StoreApi } from 'zustand';

import StoreContext from '../contexts/RFStoreContext';
import type { ReactFlowState } from '../types';

const errorMessage =
  '[React Flow]: Seems like you have not used zustand provider as an ancestor. Help: https://reactflow.dev/error#100';

type ExtractState = StoreApi<ReactFlowState> extends { getState: () => infer T } ? T : never;

function useStore<StateSlice = ExtractState>(
  selector: (state: ReactFlowState) => StateSlice,
  equalityFn?: (a: StateSlice, b: StateSlice) => boolean
) {
  const store = useContext(StoreContext);

  if (store === null) {
    throw new Error(errorMessage);
  }

  return useZustandStore(store, selector, equalityFn);
}

const useStoreApi = () => {
  const store = useContext(StoreContext);

  if (store === null) {
    throw new Error(errorMessage);
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
};

export { useStore, useStoreApi };
