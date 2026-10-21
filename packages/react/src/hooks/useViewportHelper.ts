import {
  pointToRendererPoint,
  getViewportForBounds,
  defaultFitViewPadding,
  type XYPosition,
  rendererPointToPoint,
  SnapGrid,
} from '@xyflow/system';

import { useReactFlowStoreApi } from './useReactFlowStore';
import type { ViewportHelperFunctions } from '../types';

/**
 * Hook for getting viewport helper functions.
 *
 * @internal
 * @returns viewport helper functions
 */
const useViewportHelper = (): ViewportHelperFunctions => {
  const { optionsStore, viewportStore } = useReactFlowStoreApi();

  return {
    zoomIn: async (options) => {
      const { panZoom } = optionsStore.getState();

      return panZoom ? panZoom.scaleBy(1.2, options) : false;
    },
    zoomOut: async (options) => {
      const { panZoom } = optionsStore.getState();

      return panZoom ? panZoom.scaleBy(1 / 1.2, options) : false;
    },
    zoomTo: async (zoomLevel, options) => {
      const { panZoom } = optionsStore.getState();

      return panZoom ? panZoom.scaleTo(zoomLevel, options) : false;
    },
    getZoom: () => viewportStore.getState().transform[2],
    setViewport: async (viewport, options) => {
      const {
        transform: [tX, tY, tZoom],
      } = viewportStore.getState();
      const { panZoom } = optionsStore.getState();

      if (!panZoom) {
        return false;
      }

      await panZoom.setViewport(
        {
          x: viewport.x ?? tX,
          y: viewport.y ?? tY,
          zoom: viewport.zoom ?? tZoom,
        },
        options
      );

      return true;
    },
    getViewport: () => {
      const [x, y, zoom] = viewportStore.getState().transform;
      return { x, y, zoom };
    },
    setCenter: async (x, y, options) => {
      return optionsStore.getState().setCenter(x, y, options);
    },
    fitBounds: async (bounds, options) => {
      const { width, height } = viewportStore.getState();
      const { minZoom, maxZoom, panZoom } = optionsStore.getState();
      const viewport = getViewportForBounds(
        bounds,
        width,
        height,
        minZoom,
        maxZoom,
        options?.padding ?? defaultFitViewPadding
      );

      if (!panZoom) {
        return false;
      }

      await panZoom.setViewport(viewport, options);

      return true;
    },
    screenToFlowPosition: (clientPosition: XYPosition, options: { snapToGrid?: boolean; snapGrid?: SnapGrid } = {}) => {
      const { transform } = viewportStore.getState();
      const { snapGrid, snapToGrid, domNode } = optionsStore.getState();

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
      const { transform } = viewportStore.getState();
      const { domNode } = optionsStore.getState();

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
};

export default useViewportHelper;
