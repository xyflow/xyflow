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
    const updateDimensions = () => {
      if (!domNode.current || !(domNode.current.checkVisibility?.() ?? true)) {
        return false;
      }
      const size = getDimensions(domNode.current);

      if (size.height === 0 || size.width === 0) {
        optionsStore.getState().onError?.('004', errorMessages['error004']());
      }

      const width = size.width || 500;
      const height = size.height || 500;
      const current = viewportStore.getState();
      if (current.width !== width || current.height !== height) {
        viewportStore.setState({ width, height });
      }
    };

    // External-store updates can synchronously flush React and resize other
    // observed elements. Publish after the current ResizeObserver delivery.
    let resizeFrame: number | null = null;
    const scheduleUpdateDimensions = () => {
      if (resizeFrame === null) {
        resizeFrame = requestAnimationFrame(() => {
          resizeFrame = null;
          updateDimensions();
        });
      }
    };

    if (domNode.current) {
      updateDimensions();
      window.addEventListener('resize', scheduleUpdateDimensions);

      const resizeObserver = new ResizeObserver(scheduleUpdateDimensions);
      resizeObserver.observe(domNode.current);

      return () => {
        window.removeEventListener('resize', scheduleUpdateDimensions);
        resizeObserver.disconnect();
        if (resizeFrame !== null) {
          cancelAnimationFrame(resizeFrame);
        }
      };
    }
  }, []);
}
