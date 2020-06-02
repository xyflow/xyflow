import { useEffect, MutableRefObject } from 'react';
import { zoom, zoomIdentity } from 'd3-zoom';
import { select, event } from 'd3-selection';

import { useStoreState, useStoreActions } from '../store/hooks';

interface UseD3ZoomParams {
  zoomPane: MutableRefObject<Element | null>;
  selectionKeyPressed: boolean;
  onMove?: () => void;
}

export default ({ zoomPane, onMove, selectionKeyPressed }: UseD3ZoomParams): void => {
  const transform = useStoreState((s) => s.transform);
  const d3Selection = useStoreState((s) => s.d3Selection);
  const d3Zoom = useStoreState((s) => s.d3Zoom);

  const initD3 = useStoreActions((actions) => actions.initD3);
  const updateTransform = useStoreActions((actions) => actions.updateTransform);

  useEffect(() => {
    if (zoomPane.current) {
      const nextD3ZoomInstance = zoom();
      const selection = select(zoomPane.current).call(nextD3ZoomInstance);
      initD3({ zoom: nextD3ZoomInstance, selection });
    }
  }, []);

  useEffect(() => {
    if (!d3Zoom) {
      return;
    }

    if (selectionKeyPressed) {
      d3Zoom.on('zoom', null);
    } else {
      d3Zoom.on('zoom', () => {
        if (event.sourceEvent && event.sourceEvent.target !== zoomPane.current) {
          return;
        }

        updateTransform(event.transform);

        if (onMove) {
          onMove();
        }
      });

      if (d3Selection && d3Zoom) {
        // we need to restore the graph transform otherwise d3 zoom transform and graph transform are not synced
        const graphTransform = zoomIdentity.translate(transform[0], transform[1]).scale(transform[2]);
        d3Selection.call(d3Zoom.transform, graphTransform);
      }
    }

    return () => {
      d3Zoom.on('zoom', null);
    };
  }, [selectionKeyPressed, d3Zoom]);
};
