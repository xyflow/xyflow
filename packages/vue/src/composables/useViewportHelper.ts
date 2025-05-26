import type { Project } from '@xyflow/system';
import type { Edge, Node, NodeLookup, State, ViewportFunctions } from '../types';
import { until } from '@vueuse/core';
import { fitViewport, getViewportForBounds, pointToRendererPoint, rendererPointToPoint } from '@xyflow/system';
import { computed } from 'vue';
import { areNodesInitialized, warn } from '../utils';

export interface ViewportHelper<NodeType extends Node = Node> extends ViewportFunctions<NodeType> {
  viewportInitialized: boolean;
  screenToFlowPosition: Project;
  flowToScreenPosition: Project;
}

const DEFAULT_PADDING = 0.1;

async function noop() {
  warn('Viewport not initialized yet.');

  return false;
}

const initialViewportHelper: ViewportHelper = {
  zoomIn: noop,
  zoomOut: noop,
  zoomTo: noop,
  fitView: noop,
  setCenter: noop,
  fitBounds: noop,
  screenToFlowPosition: position => position,
  flowToScreenPosition: position => position,
  setViewport: noop,
  getViewport: () => ({ x: 0, y: 0, zoom: 1 }),
  viewportInitialized: false,
};

/**
 * Composable that provides viewport helper functions.
 *
 * @internal
 * @param state
 */
export function useViewportHelper<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  state: State<NodeType, EdgeType>,
  nodeLookup: NodeLookup<NodeType>,
) {
  // whether every (non-hidden) node has been measured — `fitView` waits on this so an imperative call right
  // after `addNodes` doesn't fit around stale (unmeasured) geometry (`getFitViewNodes` skips unmeasured nodes)
  const nodesInitialized = computed(() => areNodesInitialized(nodeLookup));

  return computed<ViewportHelper<NodeType>>(() => {
    const panZoom = state.panZoom;
    const isInitialized = state.panZoom && state.dimensions.width && state.dimensions.height;

    if (!isInitialized) {
      return initialViewportHelper;
    }

    return {
      viewportInitialized: true,
      // todo: allow passing scale as option
      zoomIn: async options => (panZoom ? panZoom.scaleBy(1.2, options) : false),
      zoomOut: async options => (panZoom ? panZoom.scaleBy(1 / 1.2, options) : false),
      zoomTo: async (zoomLevel, options) => (panZoom ? panZoom.scaleTo(zoomLevel, options) : false),
      setViewport: async (viewport, options) => {
        if (!panZoom) {
          return false;
        }

        await panZoom.setViewport(
          {
            x: viewport.x ?? state.transform[0],
            y: viewport.y ?? state.transform[1],
            zoom: viewport.zoom ?? state.transform[2],
          },
          options,
        );

        return true;
      },
      getViewport: () => ({
        x: state.transform[0],
        y: state.transform[1],
        zoom: state.transform[2],
      }),
      fitView: async (
        options = {
          padding: DEFAULT_PADDING,
          includeHiddenNodes: false,
          duration: 0,
        },
      ) => {
        if (!panZoom) {
          return false;
        }

        // queue the fit until every node is measured (xyflow/react's `fitViewQueued`): a fit requested
        // before the nodes settle — e.g. right after `addNodes` — would otherwise frame only the already
        // measured nodes (`getFitViewNodes` skips unmeasured ones) and ignore the new ones. An empty flow has
        // nothing to wait for, so don't queue (else the fit would never resolve).
        if (nodeLookup.size > 0 && !nodesInitialized.value) {
          await until(nodesInitialized).toBe(true);
        }

        return fitViewport(
          {
            nodes: nodeLookup,
            width: state.dimensions.width,
            height: state.dimensions.height,
            panZoom,
            minZoom: state.minZoom,
            maxZoom: state.maxZoom,
          },
          {
            padding: options.padding ?? DEFAULT_PADDING,
            duration: options.duration,
            ease: options.ease,
            interpolate: options.interpolate,
            minZoom: options.minZoom,
            maxZoom: options.maxZoom,
            // `fitViewport` forwards these to `getFitViewNodes` at runtime, but its options type `Omit`s
            // them — pass via spread to satisfy TS.
            ...(options.includeHiddenNodes ? { includeHiddenNodes: true } : {}),
            ...(options.nodes?.length ? { nodes: options.nodes } : {}),
          },
        );
      },
      setCenter: async (x, y, options) => {
        if (!panZoom) {
          return false;
        }

        const nextZoom = typeof options?.zoom !== 'undefined' ? options.zoom : state.maxZoom;
        const centerX = state.dimensions.width / 2 - x * nextZoom;
        const centerY = state.dimensions.height / 2 - y * nextZoom;

        await panZoom.setViewport({ x: centerX, y: centerY, zoom: nextZoom }, options);

        return true;
      },
      fitBounds: async (bounds, options = { padding: DEFAULT_PADDING }) => {
        if (!panZoom) {
          return false;
        }

        const { x, y, zoom } = getViewportForBounds(
          bounds,
          state.dimensions.width,
          state.dimensions.height,
          state.minZoom,
          state.maxZoom,
          options.padding ?? DEFAULT_PADDING,
        );

        await panZoom.setViewport({ x, y, zoom }, options);

        return true;
      },
      screenToFlowPosition: (position) => {
        if (state.vueFlowRef) {
          const { x: domX, y: domY } = state.vueFlowRef.getBoundingClientRect();

          const correctedPosition = {
            x: position.x - domX,
            y: position.y - domY,
          };

          return pointToRendererPoint(correctedPosition, state.transform, state.snapToGrid, state.snapGrid);
        }

        return { x: 0, y: 0 };
      },
      flowToScreenPosition: (position) => {
        if (state.vueFlowRef) {
          const { x: domX, y: domY } = state.vueFlowRef.getBoundingClientRect();

          const correctedPosition = {
            x: position.x + domX,
            y: position.y + domY,
          };

          return rendererPointToPoint(correctedPosition, state.transform);
        }

        return { x: 0, y: 0 };
      },
    };
  });
}
