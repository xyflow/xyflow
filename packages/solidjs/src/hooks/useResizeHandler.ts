import { errorMessages, getDimensions } from '@xyflow/system';

import { useStoreApi } from './useStore';
import { createEffect, onCleanup } from 'solid-js';

/**
 * Hook for handling resize events.
 *
 * @internal
 */
export function useResizeHandler(getDomNode: () => HTMLDivElement | null): void {
  const store = useStoreApi();

  createEffect(() => {
    const domNode = getDomNode();
    const updateDimensions = () => {
      if (!domNode) {
        return false;
      }
      const size = getDimensions(domNode);

      if (size.height === 0 || size.width === 0) {
        store.onError.get()?.('004', errorMessages['error004']());
      }

      store.batch((store) => {
        store.width.set(size.width || 500);
        store.height.set(size.height || 500);
      });
    };

    if (domNode) {
      updateDimensions();
      window.addEventListener('resize', updateDimensions);

      const resizeObserver = new ResizeObserver(() => updateDimensions());
      resizeObserver.observe(domNode);

      onCleanup(() => {
        window.removeEventListener('resize', updateDimensions);

        if (resizeObserver && domNode) {
          resizeObserver.unobserve(domNode);
        }
      });
    }
  });
}
