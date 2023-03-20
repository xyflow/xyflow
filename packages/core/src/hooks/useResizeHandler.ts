import { useEffect } from 'react';
import type { MutableRefObject } from 'react';

import { useStoreApi } from '../hooks/useStore';
import { getDimensions } from '../utils';
import { errorMessages } from '../contants';

function useResizeHandler(rendererNode: MutableRefObject<HTMLDivElement | null>): void {
  const store = useStoreApi();

  useEffect(() => {
    let resizeObserver: ResizeObserver;

    const updateDimensions = () => {
      if (!rendererNode.current) {
        return;
      }

      const size = getDimensions(rendererNode.current);

      if (size.height === 0 || size.width === 0) {
        store.getState().onError?.('004', errorMessages['error004']());
      }

      store.setState({ width: size.width || 500, height: size.height || 500 });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    if (rendererNode.current) {
      resizeObserver = new ResizeObserver(() => updateDimensions());
      resizeObserver.observe(rendererNode.current);
    }

    return () => {
      window.removeEventListener('resize', updateDimensions);

      if (resizeObserver && rendererNode.current) {
        resizeObserver.unobserve(rendererNode.current!);
      }
    };
  }, []);
}

export default useResizeHandler;
