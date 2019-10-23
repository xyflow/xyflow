import { useEffect, MutableRefObject } from 'react';
import * as d3Zoom from 'd3-zoom';
import { select, event } from 'd3-selection';

import { useStoreState, useStoreActions } from '../store/hooks';

const d3ZoomInstance = d3Zoom
  .zoom()
  .scaleExtent([0.5, 2])
  .filter(() => !event.button);

export default (zoomPane: MutableRefObject<Element | null>, onMove: () => void, shiftPressed: boolean): void => {
  const state = useStoreState(s => ({
    transform: s.transform,
    d3Selection: s.d3Selection,
    d3Zoom: s.d3Zoom,
  }));

  const initD3 = useStoreActions(actions => actions.initD3);
  const updateTransform = useStoreActions(actions => actions.updateTransform);

  useEffect(() => {
    if (zoomPane.current) {
      const selection = select(zoomPane.current).call(d3ZoomInstance);
      initD3({ zoom: d3ZoomInstance, selection });
    }
  }, []);

  useEffect(() => {
    if (shiftPressed) {
      d3ZoomInstance.on('zoom', null);
    } else {
      d3ZoomInstance.on('zoom', () => {
        if (event.sourceEvent && event.sourceEvent.target !== zoomPane.current) {
          return;
        }

        updateTransform(event.transform);

        onMove();
      });

      if (state.d3Selection && state.d3Zoom) {
        // we need to restore the graph transform otherwise d3 zoom transform and graph transform are not synced
        const graphTransform = d3Zoom.zoomIdentity
          .translate(state.transform[0], state.transform[1])
          .scale(state.transform[2]);

        state.d3Selection.call(state.d3Zoom.transform, graphTransform);
      }
    }

    return () => {
      d3ZoomInstance.on('zoom', null);
    };
  }, [shiftPressed]);
};
