import { useMemo } from 'react';
import {
  pointToRendererPoint,
  getViewportForBounds,
  type XYPosition,
  rendererPointToPoint,
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
          return Promise.resolve(false);
        }

        await panZoom.setViewport(
          {
            x: viewport.x ?? tX,
            y: viewport.y ?? tY,
            zoom: viewport.zoom ?? tZoom,
          },
          options
        );

        return Promise.resolve(true);
      },
      getViewport: () => {
        const [x, y, zoom] = store.getState().transform;
        return { x, y, zoom };
      },
      setCenter: async (x, y, options) => {
        return store.getState().setCenter(x, y, options);
      },
      fitBounds: async (bounds, options) => {
        const { width, height, minZoom, maxZoom, panZoom } = store.getState();
        const viewport = getViewportForBounds(bounds, width, height, minZoom, maxZoom, options?.padding ?? 0.1);

        if (!panZoom) {
          return Promise.resolve(false);
        }

        await panZoom.setViewport(viewport, {
          duration: options?.duration,
          ease: options?.ease,
          interpolate: options?.interpolate,
        });

        return Promise.resolve(true);
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
