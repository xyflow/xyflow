import { useMemo } from 'react';
import { zoomIdentity } from 'd3-zoom';

import { useStoreState, useStore } from '../store/hooks';
import { clamp } from '../utils';
import { getRectOfNodes } from '../utils/graph';
import { FitViewParams, FlowTransform, ZoomPanHelperFunctions } from '../types';

const initialZoomPanHelper: ZoomPanHelperFunctions = {
  zoomIn: () => {},
  zoomOut: () => {},
  zoomTo: (_: number) => {},
  transform: (_: FlowTransform) => {},
  fitView: (_: FitViewParams = { padding: 0.1 }) => {},
  setCenter: (_: number, __: number) => {},
  initialized: false,
};

const usePanZoomHelper = (): ZoomPanHelperFunctions => {
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
        fitView: (options: FitViewParams = { padding: 0.1 }) => {
          const { nodes, width, height, minZoom, maxZoom } = store.getState();

          if (!nodes.length) {
            return;
          }

          const bounds = getRectOfNodes(nodes);
          const xZoom = width / (bounds.width * (1 + options.padding));
          const yZoom = height / (bounds.height * (1 + options.padding));
          const zoom = Math.min(xZoom, yZoom);
          const clampedZoom = clamp(zoom, minZoom, maxZoom);
          const boundsCenterX = bounds.x + bounds.width / 2;
          const boundsCenterY = bounds.y + bounds.height / 2;
          const x = width / 2 - boundsCenterX * clampedZoom;
          const y = height / 2 - boundsCenterY * clampedZoom;
          const transform = zoomIdentity.translate(x, y).scale(clampedZoom);

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
        initialized: true,
      };
    }

    return initialZoomPanHelper;
  }, [d3Zoom, d3Selection]);

  return zoomPanHelperFunctions;
};

export default usePanZoomHelper;
