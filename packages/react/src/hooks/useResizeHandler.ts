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
    const updateDimensions = () => {
      if (!domNode.current || !(domNode.current.checkVisibility?.() ?? true)) {
        return false;
      }
      const size = getDimensions(domNode.current);

      if (size.height === 0 || size.width === 0) {
        store.getState().onError?.('004', errorMessages['error004']());
      }

      const nextWidth = size.width || 500;
      const nextHeight = size.height || 500;
      const { width, height } = store.getState();

      if (nextWidth === width && nextHeight === height) {
        return;
      }

      store.setState({ width: nextWidth, height: nextHeight });
    };

    if (domNode.current) {
      let frameId: number | null = null;
      updateDimensions();
      window.addEventListener('resize', updateDimensions);

      const resizeObserver = new ResizeObserver(() => {
        if (frameId === null) {
          frameId = requestAnimationFrame(() => {
            frameId = null;
            updateDimensions();
          });
        }
      });
      resizeObserver.observe(domNode.current);

      return () => {
        window.removeEventListener('resize', updateDimensions);

        if (frameId !== null) {
          cancelAnimationFrame(frameId);
        }

        if (resizeObserver && domNode.current) {
          resizeObserver.unobserve(domNode.current);
        }
      };
    }
  }, []);
}
