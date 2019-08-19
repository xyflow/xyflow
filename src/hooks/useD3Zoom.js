import { useEffect, useContext } from 'react';
import * as d3Zoom from 'd3-zoom';
import { select, event } from 'd3-selection';

import { updateTransform, initD3 } from '../state/view-actions';
import { GraphContext } from '../GraphContext';

const d3ZoomInstance = d3Zoom.zoom().scaleExtent([0.5, 2]);

export default function useD3Zoom(zoomPane, onMove, shiftPressed) {
  const { state, dispatch } = useContext(GraphContext);

  useEffect(() => {
    const selection = select(zoomPane.current).call(d3ZoomInstance);
    dispatch(initD3({ zoom: d3ZoomInstance, selection }));
  }, []);

  useEffect(() => {
    if (shiftPressed) {
      d3ZoomInstance.on('zoom', null);
    } else {
      d3ZoomInstance.on('zoom', () => {
        if (event.sourceEvent && event.sourceEvent.target !== zoomPane.current) {
          return false;
        }

        dispatch(updateTransform(event.transform));

        onMove();
      });

      if (state.d3Selection) {
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
}
