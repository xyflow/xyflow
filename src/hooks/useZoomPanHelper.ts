import { useMemo } from 'react';
import { zoomIdentity } from 'd3-zoom';
import shallow from 'zustand/shallow';
import { Selection as D3Selection } from 'd3';

import { useStoreApi, useStore } from '../store';
import { getRectOfNodeInternals, pointToRendererPoint, getTransformForBounds } from '../utils/graph';
import { FitViewParams, FlowTransform, ZoomPanHelperFunctions, ReactFlowState, Rect, XYPosition } from '../types';

const DEFAULT_PADDING = 0.1;

const initialZoomPanHelper: ZoomPanHelperFunctions = {
  zoomIn: () => {},
  zoomOut: () => {},
  zoomTo: (_: number) => {},
  transform: (_: FlowTransform) => {},
  fitView: (_: FitViewParams = { padding: DEFAULT_PADDING, includeHiddenNodes: false }) => {},
  setCenter: (_: number, __: number) => {},
  fitBounds: (_: Rect) => {},
  project: (position: XYPosition) => position,
  initialized: false,
};

const selector = (s: ReactFlowState) => ({
  d3Zoom: s.d3Zoom,
  d3Selection: s.d3Selection,
});

const getTransition = (selection: D3Selection<Element, unknown, null, undefined>, duration: number = 0) => {
  return selection.transition().duration(duration);
};

const useZoomPanHelper = (): ZoomPanHelperFunctions => {
  const store = useStoreApi();
  const { d3Zoom, d3Selection } = useStore(selector, shallow);

  const zoomPanHelperFunctions = useMemo<ZoomPanHelperFunctions>(() => {
    if (d3Selection && d3Zoom) {
      return {
        zoomIn: (options) => d3Zoom.scaleBy(getTransition(d3Selection, options?.duration), 1.2),
        zoomOut: (options) => d3Zoom.scaleBy(getTransition(d3Selection, options?.duration), 1 / 1.2),
        zoomTo: (zoomLevel, options) =>
          d3Zoom.scaleTo(getTransition(d3Selection, options?.duration), zoomLevel),
        transform: (transform: FlowTransform) => {
          const nextTransform = zoomIdentity.translate(transform.x, transform.y).scale(transform.zoom);

          d3Zoom.transform(getTransition(d3Selection), nextTransform);
        },
        fitView: (options) => {
          const { nodeInternals, width, height, minZoom, maxZoom } = store.getState();
          // @TODO: work with nodeInternals instead of converting it to an array
          const nodes = Array.from(nodeInternals).map(([_, node]) => node);

          if (!nodes.length) {
            return;
          }

          const bounds = getRectOfNodeInternals(
            options?.includeHiddenNodes ? nodes : nodes.filter((node) => !node.hidden)
          );
          const [x, y, zoom] = getTransformForBounds(
            bounds,
            width,
            height,
            options?.minZoom ?? minZoom,
            options?.maxZoom ?? maxZoom,
            options?.padding ?? DEFAULT_PADDING
          );
          const transform = zoomIdentity.translate(x, y).scale(zoom);

          d3Zoom.transform(getTransition(d3Selection, options?.duration), transform);
        },
        setCenter: (x, y, options) => {
          const { width, height, maxZoom } = store.getState();

          const nextZoom = typeof options?.zoom !== 'undefined' ? options.zoom : maxZoom;
          const centerX = width / 2 - x * nextZoom;
          const centerY = height / 2 - y * nextZoom;
          const transform = zoomIdentity.translate(centerX, centerY).scale(nextZoom);
          d3Zoom.transform(getTransition(d3Selection, options?.duration), transform);
        },
        fitBounds: (bounds, options) => {
          const { width, height, minZoom, maxZoom } = store.getState();
          const [x, y, zoom] = getTransformForBounds(bounds, width, height, minZoom, maxZoom, options?.padding ?? DEFAULT_PADDING);
          const transform = zoomIdentity.translate(x, y).scale(zoom);

          d3Zoom.transform(getTransition(d3Selection, options?.duration), transform);
        },
        project: (position: XYPosition) => {
          const { transform, snapToGrid, snapGrid } = store.getState();
          return pointToRendererPoint(position, transform, snapToGrid, snapGrid);
        },
        initialized: true,
      };
    }

    return initialZoomPanHelper;
  }, [d3Zoom, d3Selection]);

  return zoomPanHelperFunctions;
};

export default useZoomPanHelper;
