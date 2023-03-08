import type { ZoomInOut } from '@reactflow/system';

import { useStore } from '$lib/store';
import type { FitViewOptions } from '$lib/types';

export function useSvelteFlow(): {
  zoomIn: ZoomInOut;
  zoomOut: ZoomInOut;
  fitView: (options?: FitViewOptions) => void;
} {
  // how to get the new context here? fit view doesn't work, because the store is not updated (uses old nodes store)
  const { zoomIn, zoomOut, fitView } = useStore();

  return {
    zoomIn,
    zoomOut,
    fitView
  };
}
