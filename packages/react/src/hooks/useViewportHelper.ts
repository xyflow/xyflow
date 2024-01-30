import { useMemo } from 'react';
import {
  pointToRendererPoint,
  getViewportForBounds,
  fitView,
  type XYPosition,
  rendererPointToPoint,
} from '@xyflow/system';

import { useStoreApi, useStore } from '../hooks/useStore';
import type { ViewportHelperFunctions, ReactFlowState } from '../types';

const selector = (s: ReactFlowState) => !!s.panZoom;

/**
 * Hook for getting viewport helper functions.
 *
 * @internal
 * @returns viewport helper functions
 */
const useViewportHelper = (): ViewportHelperFunctions => {
  const store = useStoreApi();
  const panZoomInitialized = useStore(selector);

  const viewportHelperFunctions = useMemo<ViewportHelperFunctions>(() => {
    return {
      zoomIn: (options) => store.getState().panZoom?.scaleBy(1.2, { duration: options?.duration }),
      zoomOut: (options) => store.getState().panZoom?.scaleBy(1 / 1.2, { duration: options?.duration }),
      zoomTo: (zoomLevel, options) => store.getState().panZoom?.scaleTo(zoomLevel, { duration: options?.duration }),
      getZoom: () => store.getState().transform[2],
      setViewport: (viewport, options) => {
        const {
          transform: [tX, tY, tZoom],
          panZoom,
        } = store.getState();

        panZoom?.setViewport(
          {
            x: viewport.x ?? tX,
            y: viewport.y ?? tY,
            zoom: viewport.zoom ?? tZoom,
          },
          { duration: options?.duration }
        );
      },
      getViewport: () => {
        const [x, y, zoom] = store.getState().transform;
        return { x, y, zoom };
      },
      fitView: (options) => {
        const { nodes, width, height, nodeOrigin, minZoom, maxZoom, panZoom } = store.getState();

        return panZoom
          ? fitView(
              {
                nodes,
                width,
                height,
                nodeOrigin,
                minZoom,
                maxZoom,
                panZoom,
              },
              options
            )
          : false;
      },
      setCenter: (x, y, options) => {
        const { width, height, maxZoom, panZoom } = store.getState();
        const nextZoom = typeof options?.zoom !== 'undefined' ? options.zoom : maxZoom;
        const centerX = width / 2 - x * nextZoom;
        const centerY = height / 2 - y * nextZoom;

        panZoom?.setViewport(
          {
            x: centerX,
            y: centerY,
            zoom: nextZoom,
          },
          { duration: options?.duration }
        );
      },
      fitBounds: (bounds, options) => {
        const { width, height, minZoom, maxZoom, panZoom } = store.getState();
        const viewport = getViewportForBounds(bounds, width, height, minZoom, maxZoom, options?.padding ?? 0.1);

        panZoom?.setViewport(viewport, { duration: options?.duration });
      },
      screenToFlowPosition: (clientPosition: XYPosition, options: { snapToGrid: boolean } = { snapToGrid: true }) => {
        const { transform, snapGrid, domNode } = store.getState();

        if (!domNode) {
          return clientPosition;
        }

        const { x: domX, y: domY } = domNode.getBoundingClientRect();

        const correctedPosition = {
          x: clientPosition.x - domX,
          y: clientPosition.y - domY,
        };

        return pointToRendererPoint(correctedPosition, transform, options.snapToGrid, snapGrid);
      },
      flowToScreenPosition: (flowPosition: XYPosition) => {
        const { transform, domNode } = store.getState();

        if (!domNode) {
          return flowPosition;
        }

        const { x: domX, y: domY } = domNode.getBoundingClientRect();
        const rendererPosition = rendererPointToPoint(flowPosition, transform);

        return {
          x: rendererPosition.x + domX,
          y: rendererPosition.y + domY,
        };
      },
      viewportInitialized: panZoomInitialized,
    };
  }, [panZoomInitialized]);

  return viewportHelperFunctions;
};

export default useViewportHelper;
