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
  const { viewportStore } = useReactFlowStoreApi();

  useEffect(() => {
    if (viewport) {
      syncViewport?.(viewport);
      viewportStore.setState({ transform: [viewport.x, viewport.y, viewport.zoom] });
    }
  }, [viewport, syncViewport, viewportStore]);

  return null;
}
