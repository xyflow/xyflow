import { useEffect, type MutableRefObject } from 'react';
import { errorMessages, getDimensions } from '@xyflow/system';

import { useStoreApi } from '../hooks/useStore';

function useResizeHandler(domNode: MutableRefObject<HTMLDivElement | null>): void {
  const store = useStoreApi();

  useEffect(() => {
    const updateDimensions = () => {
      if (!domNode.current) {
        return false;
      }
      const size = getDimensions(domNode.current!);

      if (size.height === 0 || size.width === 0) {
        store.getState().onError?.('004', errorMessages['error004']());
      }

      store.setState((state) => {
        if (size.width === state.width && size.height === state.height) {
          // Nothing has changed, no need to trigger a state update
          return state;
        }

        return { width: size.width || 500, height: size.height || 500 };
      });
    };

    if (domNode.current) {
      updateDimensions();
      window.addEventListener('resize', updateDimensions);

      const resizeObserver = new ResizeObserver(() => updateDimensions());
      resizeObserver.observe(domNode.current);

      return () => {
        window.removeEventListener('resize', updateDimensions);

        if (resizeObserver && domNode.current) {
          resizeObserver.unobserve(domNode.current);
        }
      };
    }
  }, []);
}

export default useResizeHandler;
