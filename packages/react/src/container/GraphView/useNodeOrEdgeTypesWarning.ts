import { useEffect, useRef } from 'react';
import { errorMessages } from '@xyflow/system';

import type { EdgeTypes, NodeTypes } from '../../types';
import { useStoreApi } from '../../hooks/useStore';

const emptyTypes = {};

/*
 * This hook warns the user if node or edgeTypes change.
 */
export function useNodeOrEdgeTypesWarning(nodeOrEdgeTypes?: NodeTypes): void;
export function useNodeOrEdgeTypesWarning(nodeOrEdgeTypes?: EdgeTypes): void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useNodeOrEdgeTypesWarning(nodeOrEdgeTypes: any = emptyTypes): any {
  const updateCount = useRef(0);
  const store = useStoreApi();

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (updateCount.current > 1) {
        store.getState().onError?.('002', errorMessages['error002']());
      }
      updateCount.current += 1;
    }
  }, [nodeOrEdgeTypes]);
}
