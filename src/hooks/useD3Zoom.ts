import { useEffect, MutableRefObject } from 'react';
import { event } from 'd3-selection';

import { useStoreState, useStoreActions } from '../store/hooks';

interface UseD3ZoomParams {
  zoomPane: MutableRefObject<Element | null>;
  selectionKeyPressed: boolean;
  zoomOnScroll: boolean;
  onMove?: () => void;
}

export default ({ zoomPane, onMove, zoomOnScroll, selectionKeyPressed }: UseD3ZoomParams): void => {
  const d3Zoom = useStoreState((s) => s.d3Zoom);

  const initD3 = useStoreActions((actions) => actions.initD3);
  const updateTransform = useStoreActions((actions) => actions.updateTransform);

  useEffect(() => {
    if (zoomPane.current) {
      initD3(zoomPane.current);
    }
  }, []);

  useEffect(() => {
    if (d3Zoom) {
      if (selectionKeyPressed) {
        d3Zoom.on('zoom', null);
      } else {
        d3Zoom.on('zoom', function () {
          if (!event.sourceEvent || (event.sourceEvent && event.sourceEvent.target !== zoomPane.current)) {
            return;
          }

          if (!zoomOnScroll && event.sourceEvent.type === 'wheel') {
            return;
          }

          updateTransform(event.transform);

          if (onMove) {
            onMove();
          }
        });
      }
    }
  }, [selectionKeyPressed, zoomOnScroll, d3Zoom]);
};
