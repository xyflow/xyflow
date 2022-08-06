import { useContext, useMemo } from 'react';
import { StoreApi, useStore as useZustandStore } from 'zustand';

import StoreContext from '../contexts/RFStoreContext';
import { ReactFlowState } from '../types';

const errorMessage = 'Seems like you have not used zustand provider as an ancestor.';

type ExtractState = StoreApi<ReactFlowState> extends { getState: () => infer T } ? T : never;

function useStore<StateSlice = ExtractState>(
  selector: (state: ExtractState) => StateSlice,
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
