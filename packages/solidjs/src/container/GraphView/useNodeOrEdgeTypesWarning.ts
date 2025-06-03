import { errorMessages } from '@xyflow/system';

import type { EdgeTypes, NodeTypes } from '../../types';
import { useStoreApi } from '../../hooks/useStore';
import { createEffect } from 'solid-js';
import { useRef } from '../../utils/hooks';

const emptyTypes = {};

/*
 * This hook warns the user if node or edgeTypes change.
 */
export function useNodeOrEdgeTypesWarning(nodeOrEdgeTypes?: () => NodeTypes | undefined): void;
export function useNodeOrEdgeTypesWarning(nodeOrEdgeTypes?: () => EdgeTypes | undefined): void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useNodeOrEdgeTypesWarning(nodeOrEdgeTypes: () => NodeTypes | EdgeTypes | undefined =  () => emptyTypes): any {
  const updateCount = useRef(0);
  const store = useStoreApi();

  createEffect(() => {
    const _types = nodeOrEdgeTypes();
    if (process.env.NODE_ENV === 'development') {
      if (updateCount.current > 1) {
        store.onError.get()?.('002', errorMessages['error002']());
      }
      updateCount.current += 1;
    }
  });
}
