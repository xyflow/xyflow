// import { useContext, useMemo } from 'react';
// import { UseBoundStoreWithEqualityFn, useStoreWithEqualityFn as useZustandStore } from 'zustand/traditional';
// import { StoreApi } from 'zustand';
import { errorMessages } from '@xyflow/system';

import StoreContext from '../contexts/StoreContext';
import type { Edge, Node, SolidFlowState } from '../types';
import { batch, useContext } from 'solid-js';

const zustandErrorMessage = errorMessages['error001']();

/**
 * Hook for accessing the internal store. Should only be used in rare cases.
 *
 * @public
 * @param selector
 * @param equalityFn
 * @returns The selected state slice
 *
 * @example
 * const nodes = useStore((state: ReactFlowState<MyNodeType>) => state.nodes);
 *
 */
function useStore<StateSlice = unknown>(
  selector: (state: SolidFlowState) => StateSlice
  // equalityFn?: (a: StateSlice, b: StateSlice) => boolean
) {
  const store = useContext(StoreContext);

  if (store === null) {
    throw new Error(zustandErrorMessage);
  }

  return selector(store);
}

function useStoreApi<NodeType extends Node = Node, EdgeType extends Edge = Edge>() {
  // TODO: Fix this type assertion
  const store = useContext(StoreContext) as unknown as SolidFlowState<NodeType, EdgeType>;

  if (store === null) {
    throw new Error(zustandErrorMessage);
  }

  return {
    ...store,
    batch: (fn: (s: SolidFlowState<NodeType, EdgeType>) => void) => {
      batch(() => {
        fn(store);
      });
    },
  };
}

export { useStore, useStoreApi };
