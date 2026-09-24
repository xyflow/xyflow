import { useEffect } from 'react';
import type { Viewport } from '@xyflow/system';

import { useOptionsStore, useReactFlowStoreApi } from './useReactFlowStore';

/**
 * Hook for syncing the viewport with the panzoom instance.
 *
 * @internal
 * @param viewport
 */
export function useViewportSync(viewport?: Viewport) {
  const panZoom = useOptionsStore((s) => s.panZoom);
  const syncViewport = panZoom?.syncViewport;
  const { viewportStore } = useReactFlowStoreApi();

  useEffect(() => {
    if (viewport) {
      syncViewport?.(viewport);
      viewportStore.setState({ transform: [viewport.x, viewport.y, viewport.zoom] });
    }
  }, [viewport, syncViewport, viewportStore]);

  return null;
}
