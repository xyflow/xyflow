import { useEffect } from 'react';
import type { Viewport } from '@xyflow/system';

import { useReactFlowStore, useReactFlowStoreApi } from './useReactFlowStore';
import type { ReactFlowState } from '../types';

const selector = (state: ReactFlowState) => state.panZoom?.syncViewport;

/**
 * Hook for syncing the viewport with the panzoom instance.
 *
 * @internal
 * @param viewport
 */
export function useViewportSync(viewport?: Viewport) {
  const syncViewport = useReactFlowStore(selector);
  const store = useReactFlowStoreApi();

  useEffect(() => {
    if (viewport) {
      syncViewport?.(viewport);
      store.setState({ transform: [viewport.x, viewport.y, viewport.zoom] });
    }
  }, [viewport, syncViewport]);

  return null;
}
