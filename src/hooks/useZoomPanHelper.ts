import { useCallback } from 'react';
import { zoomIdentity } from 'd3-zoom';
import { useStoreState, useStore } from '../store/hooks';

import { clamp } from '../utils';
import { getRectOfNodes } from '../utils/graph';
import { FitViewParams } from '../types';

export default () => {
  const store = useStore();
  const d3Zoom = useStoreState((s) => s.d3Zoom);
  const d3Selection = useStoreState((s) => s.d3Selection);

  const zoomIn = useCallback(() => {
    if (d3Selection) {
      d3Zoom?.scaleBy(d3Selection, 1.2);
    }
  }, [d3Zoom, d3Selection]);

  const zoomOut = useCallback(() => {
    if (d3Selection) {
      d3Zoom?.scaleBy(d3Selection, 1 / 1.2);
    }
  }, [d3Zoom, d3Selection]);

  const zoomTo = useCallback(
    (zoomLevel: number) => {
      if (d3Selection) {
        d3Zoom?.scaleTo(d3Selection, zoomLevel);
      }
    },
    [d3Zoom, d3Selection]
  );

  const fitView = useCallback(
    (options: FitViewParams) => {
      const { padding = 0.1 } = options;
      const { nodes, width, height, minZoom, maxZoom } = store.getState();

      if (!d3Selection || !nodes.length) {
        return;
      }

      const bounds = getRectOfNodes(nodes);
      const xZoom = width / (bounds.width * (1 + padding));
      const yZoom = height / (bounds.height * (1 + padding));
      const zoom = Math.min(xZoom, yZoom);
      const clampedZoom = clamp(zoom, minZoom, maxZoom);
      const boundsCenterX = bounds.x + bounds.width / 2;
      const boundsCenterY = bounds.y + bounds.height / 2;
      const x = width / 2 - boundsCenterX * clampedZoom;
      const y = height / 2 - boundsCenterY * clampedZoom;
      const k = clampedZoom;
      const transform = zoomIdentity.translate(x, y).scale(k);

      d3Zoom?.transform(d3Selection, transform);
    },
    [store, d3Zoom, d3Selection]
  );

  return {
    zoomIn,
    zoomOut,
    zoomTo,
    fitView,
  };
};
