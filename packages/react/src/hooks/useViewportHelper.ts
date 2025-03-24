import { useMemo } from 'react';
import {
  pointToRendererPoint,
  getViewportForBounds,
  getFitViewNodes,
  fitView,
  type XYPosition,
  rendererPointToPoint,
  getDimensions,
  SnapGrid,
} from '@xyflow/system';

import { useStoreApi } from '../hooks/useStore';
import type { ViewportHelperFunctions } from '../types';

/**
 * Hook for getting viewport helper functions.
 *
 * @internal
 * @returns viewport helper functions
 */
const useViewportHelper = (): ViewportHelperFunctions => {
  const store = useStoreApi();

  return useMemo<ViewportHelperFunctions>(() => {
    return {
      zoomIn: (options) => {
        const { panZoom } = store.getState();

        return panZoom ? panZoom.scaleBy(1.2, { duration: options?.duration }) : Promise.resolve(false);
      },
      zoomOut: (options) => {
        const { panZoom } = store.getState();

        return panZoom ? panZoom.scaleBy(1 / 1.2, { duration: options?.duration }) : Promise.resolve(false);
      },
      zoomTo: (zoomLevel, options) => {
        const { panZoom } = store.getState();

        return panZoom ? panZoom.scaleTo(zoomLevel, { duration: options?.duration }) : Promise.resolve(false);
      },
      getZoom: () => store.getState().transform[2],
      setViewport: async (viewport, options) => {
        const {
          transform: [tX, tY, tZoom],
          panZoom,
        } = store.getState();

        if (!panZoom) {
          return false;
        }

        await panZoom.setViewport(
          {
            x: viewport.x ?? tX,
            y: viewport.y ?? tY,
            zoom: viewport.zoom ?? tZoom,
          },
          { duration: options?.duration }
        );

        return true;
      },
      getViewport: () => {
        const [x, y, zoom] = store.getState().transform;
        return { x, y, zoom };
      },
      fitView: (options) => {
        const { nodeLookup, minZoom, maxZoom, panZoom, domNode } = store.getState();

        if (!panZoom || !domNode) {
          return Promise.resolve(false);
        }

        const fitViewNodes = getFitViewNodes(nodeLookup, options);
        const { width, height } = getDimensions(domNode);

        return fitView(
          {
            nodes: fitViewNodes,
            width,
            height,
            minZoom,
            maxZoom,
            panZoom,
          },
          options
        );
      },
      setCenter: async (x, y, options) => {
        const { width, height, maxZoom, panZoom } = store.getState();
        const nextZoom = typeof options?.zoom !== 'undefined' ? options.zoom : maxZoom;
        const centerX = width / 2 - x * nextZoom;
        const centerY = height / 2 - y * nextZoom;

        if (!panZoom) {
          return false;
        }

        await panZoom.setViewport(
          {
            x: centerX,
            y: centerY,
            zoom: nextZoom,
          },
          { duration: options?.duration }
        );

        return true;
      },
      fitBounds: async (bounds, options) => {
        const { width, height, minZoom, maxZoom, panZoom } = store.getState();
        const viewport = getViewportForBounds(bounds, width, height, minZoom, maxZoom, options?.padding ?? 0.1);

        if (!panZoom) {
          return false;
        }

        await panZoom.setViewport(viewport, { duration: options?.duration });

        return true;
      },
      screenToFlowPosition: (
        clientPosition: XYPosition,
        options: { snapToGrid?: boolean; snapGrid?: SnapGrid } = {}
      ) => {
        const { transform, snapGrid, snapToGrid, domNode } = store.getState();

        if (!domNode) {
          return clientPosition;
        }

        const { x: domX, y: domY } = domNode.getBoundingClientRect();
        const correctedPosition = {
          x: clientPosition.x - domX,
          y: clientPosition.y - domY,
        };
        const _snapGrid = options.snapGrid ?? snapGrid;
        const _snapToGrid = options.snapToGrid ?? snapToGrid;

        return pointToRendererPoint(correctedPosition, transform, _snapToGrid, _snapGrid);
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
    };
  }, []);
};

export default useViewportHelper;
