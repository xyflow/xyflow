import type { NodeLookup, Project } from '@xyflow/system';
import type { Edge, InternalNode, Node, State, ViewportFunctions } from '../types';
import { getViewportForBounds, pointToRendererPoint, rendererPointToPoint, withResolvers } from '@xyflow/system';
import { computed, markRaw, nextTick } from 'vue';
import { resolveFitView } from '../store/fitView';
import { areNodesInitialized, warn } from '../utils';

export interface ViewportHelper<NodeType extends Node = Node> extends ViewportFunctions<NodeType> {
  viewportInitialized: boolean;
  screenToFlowPosition: Project;
  flowToScreenPosition: Project;
}

const DEFAULT_PADDING = '5%';

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
  nodeLookup: NodeLookup<InternalNode<NodeType>>,
) {
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
      fitView: async (options) => {
        if (!panZoom) {
          return false;
        }

        const resolver = (state.fitViewQueued && state.fitViewQueued.resolver) || withResolvers<boolean>();
        state.fitViewQueued = markRaw({ options, resolver });

        // A node commit settles the queue against fresh geometry: a same-tick reposition or `addNodes`
        // triggers `commitNodes` (which resolves once measured), and `addNodes` also resolves via the
        // measurement commit. Wait one tick for that. If nothing committed, this was a standalone `fitView()`
        // (e.g. a toolbar button) with no pending change, resolve it directly so it doesn't hang. Waiting
        // first also avoids resolving against a reposition's not-yet-committed (stale) positions.
        await nextTick();

        if (state.fitViewQueued && (nodeLookup.size === 0 || areNodesInitialized(nodeLookup))) {
          resolveFitView(state, nodeLookup);
        }
        // still queued + unmeasured: a later measurement commit settles it

        return resolver.promise;
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

          const rendererPosition = rendererPointToPoint(position, state.transform);

          return { x: rendererPosition.x + domX, y: rendererPosition.y + domY };
        }

        return { x: 0, y: 0 };
      },
    };
  });
}
