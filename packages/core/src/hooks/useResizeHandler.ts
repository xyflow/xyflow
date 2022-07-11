import { useEffect, MutableRefObject } from 'react';

import { useStoreApi } from '../store';
import { getDimensions } from '../utils';

function useResizeHandler(rendererNode: MutableRefObject<HTMLDivElement | null>): void {
  const store = useStoreApi();

  useEffect(() => {
    let resizeObserver: ResizeObserver;

    const updateDimensions = () => {
      if (!rendererNode.current) {
        return;
      }

      const size = getDimensions(rendererNode.current);

      // @ts-ignore
      if (process.env.NODE_ENV === 'development') {
        if (size.height === 0 || size.width === 0) {
          console.warn(
            '[React Flow]: The React Flow parent container needs a width and a height to render the graph. Help: https://reactflow.dev/error#400'
          );
        }
      }

      store.setState({ width: size.width || 500, height: size.height || 500 });
    };

    updateDimensions();
    window.onresize = updateDimensions;

    if (rendererNode.current) {
      resizeObserver = new ResizeObserver(() => updateDimensions());
      resizeObserver.observe(rendererNode.current);
    }

    return () => {
      window.onresize = null;

      if (resizeObserver && rendererNode.current) {
        resizeObserver.unobserve(rendererNode.current!);
      }
    };
  }, []);
}

export default useResizeHandler;
