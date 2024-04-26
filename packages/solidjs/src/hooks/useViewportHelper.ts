import {
  pointToRendererPoint,
  getViewportForBounds,
  fitView,
  type XYPosition,
  rendererPointToPoint,
} from '@xyflow/system';

import { useStoreApi, useStore } from './useStore';
import type { ViewportHelperFunctions, SolidFlowState } from '../types';

const selector = (s: SolidFlowState) => () => !!s.panZoom.get();

/**
 * Hook for getting viewport helper functions.
 *
 * @internal
 * @returns viewport helper functions
 */
const useViewportHelper = (): ViewportHelperFunctions => {
  const store = useStoreApi();
  const panZoomInitialized = useStore(selector);

  const viewportHelperFunctions = (): ViewportHelperFunctions => {
    return {
      zoomIn: (options) => store.panZoom.get()?.scaleBy(1.2, { duration: options?.duration }),
      zoomOut: (options) => store.panZoom.get()?.scaleBy(1 / 1.2, { duration: options?.duration }),
      zoomTo: (zoomLevel, options) => store.panZoom.get()?.scaleTo(zoomLevel, { duration: options?.duration }),
      getZoom: () => store.transform.get()[2],
      setViewport: (viewport, options) => {
        const { panZoom } = store;

        const [tX, tY, tZoom] = store.transform.get();

        panZoom.get()?.setViewport(
          {
            x: viewport.x ?? tX,
            y: viewport.y ?? tY,
            zoom: viewport.zoom ?? tZoom,
          },
          { duration: options?.duration }
        );
      },
      getViewport: () => {
        const [x, y, zoom] = store.transform.get();
        return { x, y, zoom };
      },
      fitView: (options) => {
        const { nodeLookup, width, height, nodeOrigin, minZoom, maxZoom, panZoom } = store;
        const panZoomValue = panZoom.get();

        return panZoomValue
          ? fitView(
              {
                nodeLookup,
                width: width.get(),
                height: height.get(),
                nodeOrigin: nodeOrigin.get(),
                minZoom: minZoom.get(),
                maxZoom: maxZoom.get(),
                panZoom: panZoomValue,
              },
              options
            )
          : false;
      },
      setCenter: (x, y, options) => {
        const { width, height, maxZoom, panZoom } = store;
        const nextZoom = typeof options?.zoom !== 'undefined' ? options.zoom : maxZoom.get();
        const centerX = width.get() / 2 - x * nextZoom;
        const centerY = height.get() / 2 - y * nextZoom;

        panZoom.get()?.setViewport(
          {
            x: centerX,
            y: centerY,
            zoom: nextZoom,
          },
          { duration: options?.duration }
        );
      },
      fitBounds: (bounds, options) => {
        const { width, height, minZoom, maxZoom, panZoom } = store;
        const viewport = getViewportForBounds(
          bounds,
          width.get(),
          height.get(),
          minZoom.get(),
          maxZoom.get(),
          options?.padding ?? 0.1
        );

        panZoom.get()?.setViewport(viewport, { duration: options?.duration });
      },
      screenToFlowPosition: (clientPosition: XYPosition, options: { snapToGrid: boolean } = { snapToGrid: true }) => {
        const { transform, snapGrid } = store;

        const domNode = store.domNode.get();

        if (!domNode) {
          return clientPosition;
        }

        const { x: domX, y: domY } = domNode.getBoundingClientRect();

        const correctedPosition = {
          x: clientPosition.x - domX,
          y: clientPosition.y - domY,
        };

        return pointToRendererPoint(correctedPosition, transform.get(), options.snapToGrid, snapGrid.get());
      },
      flowToScreenPosition: (flowPosition: XYPosition) => {
        const { transform } = store;

        const domNode = store.domNode.get();

        if (!domNode) {
          return flowPosition;
        }

        const { x: domX, y: domY } = domNode.getBoundingClientRect();
        const rendererPosition = rendererPointToPoint(flowPosition, transform.get());

        return {
          x: rendererPosition.x + domX,
          y: rendererPosition.y + domY,
        };
      },

      viewportInitialized: panZoomInitialized,
    };
  };

  return viewportHelperFunctions();
};

export default useViewportHelper;
