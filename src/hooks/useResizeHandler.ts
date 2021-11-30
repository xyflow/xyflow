import { useEffect, MutableRefObject } from 'react';

import { useStore } from '../store';
import { getDimensions } from '../utils';
import { ReactFlowState } from '../types';

const updateSizeSelector = (state: ReactFlowState) => state.updateSize;

function useResizeHandler(rendererNode: MutableRefObject<HTMLDivElement | null>): void {
  const updateSize = useStore(updateSizeSelector);

  useEffect(() => {
    let resizeObserver: ResizeObserver;

    const updateDimensions = () => {
      if (!rendererNode.current) {
        return;
      }

      const size = getDimensions(rendererNode.current);

      if (size.height === 0 || size.width === 0) {
        console.warn('The React Flow parent container needs a width and a height to render the graph.');
      }

      updateSize(size);
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
