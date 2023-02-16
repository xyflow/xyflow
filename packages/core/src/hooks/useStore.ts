import { useContext, useMemo } from 'react';
import { useStore as useZustandStore, type StoreApi } from 'zustand';
import { errorMessages, type ReactFlowState } from '@reactflow/system';

import StoreContext from '../contexts/RFStoreContext';

const zustandErrorMessage = errorMessages['001']();

type ExtractState = StoreApi<ReactFlowState> extends { getState: () => infer T } ? T : never;

function useStore<StateSlice = ExtractState>(
  selector: (state: ReactFlowState) => StateSlice,
  equalityFn?: (a: StateSlice, b: StateSlice) => boolean
) {
  const store = useContext(StoreContext);

  if (store === null) {
    throw new Error(zustandErrorMessage);
  }

  return useZustandStore(store, selector, equalityFn);
}

const useStoreApi = () => {
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
};

export { useStore, useStoreApi };
