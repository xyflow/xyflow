import { useEffect, type MutableRefObject } from 'react';
import { errorMessages, getDimensions } from '@xyflow/system';

import { useStoreApi } from '../hooks/useStore';

/**
 * Hook for handling resize events.
 *
 * @internal
 */
export function useResizeHandler(domNode: MutableRefObject<HTMLDivElement | null>): void {
  const store = useStoreApi();

  useEffect(() => {
    let fitViewRaf = 0;

    const updateDimensions = () => {
      if (!domNode.current || !(domNode.current.checkVisibility?.() ?? true)) {
        return false;
      }
      const size = getDimensions(domNode.current);

      if (size.height === 0 || size.width === 0) {
        store.getState().onError?.('004', errorMessages['error004']());
      }

      store.setState({ width: size.width || 500, height: size.height || 500 });

      // container is measured now, resolve a fitView that was queued before we had dimensions
      if (store.getState().fitViewQueued) {
        cancelAnimationFrame(fitViewRaf);
        fitViewRaf = requestAnimationFrame(() => store.getState().resolveFitViewIfReady());
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

        if (resizeObserver && domNode.current) {
          resizeObserver.unobserve(domNode.current);
        }
      };
    }
  }, []);
}
