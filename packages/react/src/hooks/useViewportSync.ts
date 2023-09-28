import { useEffect } from 'react';
import type { Viewport } from '@xyflow/system';

import { useStore, useStoreApi } from './useStore';
import type { ReactFlowState } from '../types';

const selector = (state: ReactFlowState) => state.panZoom?.syncViewport;

export default function useViewportSync(viewport?: Viewport) {
  const syncViewport = useStore(selector);
  const store = useStoreApi();

  useEffect(() => {
    if (viewport) {
      syncViewport?.(viewport);
      store.setState({ transform: [viewport.x, viewport.y, viewport.zoom] });
    }
  }, [viewport, syncViewport]);

  return null;
}
