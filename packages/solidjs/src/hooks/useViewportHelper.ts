import { createMemo } from 'solid-js';
import {
  pointToRendererPoint,
  getViewportForBounds,
  type XYPosition,
  rendererPointToPoint,
  type SnapGrid,
} from '@xyflow/system';

import { useStoreApi } from './useStore';
import type { ViewportHelperFunctions } from '../types';

/**
 * Hook for getting viewport helper functions.
 *
 * @internal
 * @returns viewport helper functions
 */
const useViewportHelper = (): ViewportHelperFunctions => {
  const store = useStoreApi();

  return createMemo<ViewportHelperFunctions>(() => {
    // Create a getState function for SolidJS that accesses reactive values
    const getState = () => ({
      panZoom: store.panZoom.get(),
      transform: store.transform.get(),
      width: store.width.get(),
      height: store.height.get(),
      minZoom: store.minZoom.get(),
      maxZoom: store.maxZoom.get(),
      nodeOrigin: store.nodeOrigin.get(),
      nodeLookup: store.nodeLookup,
      snapGrid: store.snapGrid.get(),
      snapToGrid: store.snapToGrid.get(),
      domNode: store.domNode.get(),
    });

    return {
      zoomIn: (options) => {
        const { panZoom } = getState();

        return panZoom ? panZoom.scaleBy(1.2, { duration: options?.duration }) : Promise.resolve(false);
      },
      zoomOut: (options) => {
        const { panZoom } = getState();

        return panZoom ? panZoom.scaleBy(1 / 1.2, { duration: options?.duration }) : Promise.resolve(false);
      },
      zoomTo: (zoomLevel, options) => {
        const { panZoom } = getState();

        return panZoom ? panZoom.scaleTo(zoomLevel, { duration: options?.duration }) : Promise.resolve(false);
      },
      getZoom: () => getState().transform[2],
      setViewport: async (viewport, options) => {
        const {
          transform: [tX, tY, tZoom],
          panZoom,
        } = getState();

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
        const [x, y, zoom] = getState().transform;
        return { x, y, zoom };
      },
      setCenter: async (x, y, options) => {
        const { width, height, maxZoom, panZoom } = getState();
        const nextZoom = typeof options?.zoom !== 'undefined' ? options.zoom : maxZoom;
        const centerX = width / 2 - x * nextZoom;
        const centerY = height / 2 - y * nextZoom;

        if (!panZoom) {
          return Promise.resolve(false);
        }

        await panZoom.setViewport(
          {
            x: centerX,
            y: centerY,
            zoom: nextZoom,
          },
          { duration: options?.duration, ease: options?.ease, interpolate: options?.interpolate }
        );

        return Promise.resolve(true);
      },
      fitBounds: async (bounds, options) => {
        const { width, height, minZoom, maxZoom, panZoom } = getState();
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
        const { transform, snapGrid, snapToGrid, domNode } = getState();

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
        const { transform, domNode } = getState();

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
  })();
};

export default useViewportHelper;
