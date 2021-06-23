import { useMemo } from 'react';
import { zoomIdentity } from 'd3-zoom';

import { useStoreState, useStore } from '../store/hooks';
import { getRectOfNodes, pointToRendererPoint, getTransformForBounds } from '../utils/graph';
import { FitViewParams, FlowTransform, ZoomPanHelperFunctions, Rect, XYPosition } from '../types';

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

const useZoomPanHelper = (): ZoomPanHelperFunctions => {
  const store = useStore();
  const d3Zoom = useStoreState((s) => s.d3Zoom);
  const d3Selection = useStoreState((s) => s.d3Selection);

  const zoomPanHelperFunctions = useMemo<ZoomPanHelperFunctions>(() => {
    if (d3Selection && d3Zoom) {
      return {
        zoomIn: () => d3Zoom.scaleBy(d3Selection, 1.2),
        zoomOut: () => d3Zoom.scaleBy(d3Selection, 1 / 1.2),
        zoomTo: (zoomLevel: number) => d3Zoom.scaleTo(d3Selection, zoomLevel),
        transform: (transform: FlowTransform) => {
          const nextTransform = zoomIdentity.translate(transform.x, transform.y).scale(transform.zoom);

          d3Zoom.transform(d3Selection, nextTransform);
        },
        fitView: (options: FitViewParams = { padding: DEFAULT_PADDING, includeHiddenNodes: false }) => {
          const { nodes, width, height, minZoom, maxZoom } = store.getState();

          if (!nodes.length) {
            return;
          }

          const bounds = getRectOfNodes(options.includeHiddenNodes ? nodes : nodes.filter((node) => !node.isHidden));
          const [x, y, zoom] = getTransformForBounds(
            bounds,
            width,
            height,
            options.minZoom ?? minZoom,
            options.maxZoom ?? maxZoom,
            options.padding ?? DEFAULT_PADDING
          );
          const transform = zoomIdentity.translate(x, y).scale(zoom);

          d3Zoom.transform(d3Selection, transform);
        },
        setCenter: (x: number, y: number, zoom?: number) => {
          const { width, height, maxZoom } = store.getState();

          const nextZoom = typeof zoom !== 'undefined' ? zoom : maxZoom;
          const centerX = width / 2 - x * nextZoom;
          const centerY = height / 2 - y * nextZoom;
          const transform = zoomIdentity.translate(centerX, centerY).scale(nextZoom);

          d3Zoom.transform(d3Selection, transform);
        },
        fitBounds: (bounds: Rect, padding = DEFAULT_PADDING) => {
          const { width, height, minZoom, maxZoom } = store.getState();
          const [x, y, zoom] = getTransformForBounds(bounds, width, height, minZoom, maxZoom, padding);
          const transform = zoomIdentity.translate(x, y).scale(zoom);

          d3Zoom.transform(d3Selection, transform);
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
