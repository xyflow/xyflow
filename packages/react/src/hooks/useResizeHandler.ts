import { useEffect, type MutableRefObject } from 'react';
import { errorMessages, getDimensions } from '@xyflow/system';

import { useReactFlowStoreApi } from './useReactFlowStore';

/**
 * Hook for handling resize events.
 *
 * @internal
 */
export function useResizeHandler(domNode: MutableRefObject<HTMLDivElement | null>): void {
  const { optionsStore, viewportStore } = useReactFlowStoreApi();

  useEffect(() => {
    let fitViewRaf = 0;

    const updateDimensions = () => {
      if (!domNode.current || !(domNode.current.checkVisibility?.() ?? true)) {
        return false;
      }
      const size = getDimensions(domNode.current);

      if (size.height === 0 || size.width === 0) {
        optionsStore.getState().onError?.('004', errorMessages['error004']());
      }

      viewportStore.setState({ width: size.width || 500, height: size.height || 500 });

      // container is measured now, resolve a fitView that was queued before we had dimensions
      if (optionsStore.getState().fitViewQueued) {
        cancelAnimationFrame(fitViewRaf);
        fitViewRaf = requestAnimationFrame(() => optionsStore.getState().resolveFitViewIfReady());
      }
    };

    if (domNode.current) {
      updateDimensions();
      window.addEventListener('resize', updateDimensions);

      const resizeObserver = new ResizeObserver(() => updateDimensions());
      resizeObserver.observe(domNode.current);

      return () => {
        cancelAnimationFrame(fitViewRaf);
        window.removeEventListener('resize', updateDimensions);
        resizeObserver.disconnect();
      };
    }
  }, []);
}
