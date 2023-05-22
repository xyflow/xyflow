import { getContext } from 'svelte';
import { derived, get } from 'svelte/store';
import { zoomIdentity } from 'd3-zoom';
import {
  type NodeDragItem,
  type NodeDimensionUpdate,
  internalsSymbol,
  type ViewportHelperFunctionOptions,
  type Connection,
  type XYPosition,
  type CoordinateExtent
} from '@reactflow/system';
import {
  createMarkerIds,
  fitView as fitViewUtil,
  getD3Transition,
  getDimensions,
  getElementsToRemove,
  getHandleBounds
} from '@reactflow/utils';

import { addEdge as addEdgeUtil } from '$lib/utils';
import type { EdgeTypes, NodeTypes, Node, Edge, ConnectionData, FitViewOptions } from '$lib/types';
import { getEdgesLayouted } from './edges-layouted';
import { getConnectionPath } from './connection-path';
import {
  initConnectionData,
  initialEdgeTypes,
  initialNodeTypes,
  initialStoreState
} from './initial-store';
import type { SvelteFlowStore } from './types';

export const key = Symbol();

type CreateStoreParams = Pick<SvelteFlowStore, 'nodes' | 'edges'>;

export function createStore(params: CreateStoreParams): SvelteFlowStore {
  const store = {
    ...initialStoreState,
    ...params
  };

  function setNodeTypes(nodeTypes: NodeTypes) {
    store.nodeTypes.set({
      ...initialNodeTypes,
      ...nodeTypes
    });
  }

  function setEdgeTypes(edgeTypes: EdgeTypes) {
    store.edgeTypes.set({
      ...initialEdgeTypes,
      ...edgeTypes
    });
  }

  function addEdge(edgeParams: Edge | Connection) {
    const edges = get(store.edges);
    store.edges.set(addEdgeUtil(edgeParams, edges));
  }

  function updateNodePositions(nodeDragItems: NodeDragItem[], dragging = false) {
    store.nodes.update((nds) => {
      return nds.map((n) => {
        const nodeDragItem = nodeDragItems.find((ndi) => ndi.id === n.id);

        if (nodeDragItem) {
          return {
            ...n,
            dragging,
            positionAbsolute: nodeDragItem.positionAbsolute,
            position: nodeDragItem.position
          };
        }

        return n;
      });
    });
  }

  function updateNodeDimensions(updates: NodeDimensionUpdate[]) {
    const viewportNode = document?.querySelector('.svelte-flow__viewport');

    if (!viewportNode) {
      return;
    }

    const style = window.getComputedStyle(viewportNode);
    const { m22: zoom } = new window.DOMMatrixReadOnly(style.transform);
    const nextNodes = get(store.nodes).map((node) => {
      const update = updates.find((u) => u.id === node.id);

      if (update) {
        const dimensions = getDimensions(update.nodeElement);

        const doUpdate = !!(
          dimensions.width &&
          dimensions.height &&
          (node.width !== dimensions.width ||
            node.height !== dimensions.height ||
            update.forceUpdate)
        );

        if (doUpdate) {
          const newNode = {
            ...node,
            width: dimensions.width,
            height: dimensions.height,
            [internalsSymbol]: {
              ...node[internalsSymbol],
              handleBounds: {
                source: getHandleBounds('.source', update.nodeElement, zoom, node.origin),
                target: getHandleBounds('.target', update.nodeElement, zoom, node.origin)
              }
            }
          };

          return newNode;
        }
      }

      return node;
    });

    const { zoom: d3Zoom, selection: d3Selection } = get(store.d3);

    const fitViewOnInitDone =
      get(store.fitViewOnInitDone) ||
      (get(store.fitViewOnInit) && !!d3Zoom && !!d3Selection && fitView({ nodes: nextNodes }));

    store.fitViewOnInitDone.set(fitViewOnInitDone);
    store.nodes.set(nextNodes);
  }

  function zoomBy(factor: number, options?: ViewportHelperFunctionOptions) {
    const { zoom: d3Zoom, selection: d3Selection } = get(store.d3);

    if (d3Zoom && d3Selection) {
      d3Zoom.scaleBy(getD3Transition(d3Selection, options?.duration), factor);
    }
  }

  function zoomIn(options?: ViewportHelperFunctionOptions) {
    zoomBy(1.2, options);
  }

  function zoomOut(options?: ViewportHelperFunctionOptions) {
    zoomBy(1 / 1.2, options);
  }

  function setMinZoom(minZoom: number) {
    const d3Zoom = get(store.d3).zoom;

    if (d3Zoom) {
      d3Zoom?.scaleExtent([minZoom, get(store.maxZoom)]);

      store.minZoom.set(minZoom);
    }
  }

  function setMaxZoom(maxZoom: number) {
    const d3Zoom = get(store.d3).zoom;
    if (d3Zoom) {
      d3Zoom?.scaleExtent([get(store.minZoom), maxZoom]);

      store.maxZoom.set(maxZoom);
    }
  }

  function fitView(options?: FitViewOptions) {
    const { zoom: d3Zoom, selection: d3Selection } = get(store.d3);

    if (!d3Zoom || !d3Selection) {
      return false;
    }

    const fitViewNodes = options?.nodes || get(store.nodes);

    return fitViewUtil(
      {
        nodes: fitViewNodes as Node[],
        width: get(store.width),
        height: get(store.height),
        minZoom: 0.2,
        maxZoom: 2,
        d3Selection,
        d3Zoom,
        nodeOrigin: [0, 0]
      },
      {}
    );
  }

  function resetSelectedItem<T extends Node | Edge>(item: T) {
    if (item.selected) {
      return {
        ...item,
        selected: false
      };
    }

    return item;
  }

  function resetSelectedElements() {
    store.nodes.update((ns) => ns.map(resetSelectedItem));
    store.edges.update((es) => es.map(resetSelectedItem));
  }

  store.deleteKeyPressed.subscribe((deleteKeyPressed) => {
    if (deleteKeyPressed) {
      const nodes = get(store.nodes);
      const edges = get(store.edges);
      const selectedNodes = nodes.filter((node) => node.selected);
      const selectedEdges = edges.filter((edge) => edge.selected);

      const { matchingNodes, matchingEdges } = getElementsToRemove<Node, Edge>({
        nodesToRemove: selectedNodes,
        edgesToRemove: selectedEdges,
        nodes,
        edges
      });

      if (matchingNodes.length || matchingEdges.length) {
        store.nodes.update((nds) =>
          nds.filter((node) => !matchingNodes.some((mN) => mN.id === node.id))
        );
        store.edges.update((eds) =>
          eds.filter((edge) => !matchingEdges.some((mE) => mE.id === edge.id))
        );
      }
    }
  });

  function addSelectedNodes(ids: string[]) {
    store.selectionRect.set(null);
    store.selectionRectMode.set(null);

    if (get(store.multiselectionKeyPressed)) {
      // @todo handle multiselection key
    }

    store.nodes.update((ns) =>
      ns.map((node) => {
        return {
          ...node,
          selected: ids.includes(node.id)
        };
      })
    );
  }

  function addSelectedEdges(ids: string[]) {
    if (get(store.multiselectionKeyPressed)) {
      // @todo handle multiselection key
    }

    store.edges.update((edges) =>
      edges.map((edge) => {
        return {
          ...edge,
          selected: ids.includes(edge.id)
        };
      })
    );
  }

  function panBy(delta: XYPosition) {
    const { zoom: d3Zoom, selection: d3Selection } = get(store.d3);
    const transform = get(store.transform);
    const width = get(store.width);
    const height = get(store.height);

    if (!d3Zoom || !d3Selection || (!delta.x && !delta.y)) {
      return;
    }

    const nextTransform = zoomIdentity
      .translate(transform[0] + delta.x, transform[1] + delta.y)
      .scale(transform[2]);

    const extent: CoordinateExtent = [
      [0, 0],
      [width, height]
    ];

    const constrainedTransform = d3Zoom?.constrain()(nextTransform, extent, [
      [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
      [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
    ]);
    d3Zoom.transform(d3Selection, constrainedTransform);
  }

  function updateConnection(connectionUpdate: Partial<ConnectionData> | null) {
    const currentConnectionData = get(store.connection);
    const nextConnectionData = currentConnectionData
      ? {
          ...initConnectionData,
          ...currentConnectionData,
          ...connectionUpdate
        }
      : {
          ...initConnectionData,
          ...connectionUpdate
        };

    store.connection.set(nextConnectionData);
  }

  function cancelConnection() {
    updateConnection(initConnectionData);
  }

  function reset() {
    store.fitViewOnInitDone.set(false);
    store.selectionRect.set(null);
    store.selectionRectMode.set(null);
    store.snapGrid.set(null);
    store.isValidConnection.set(() => true);

    resetSelectedElements();
    cancelConnection();
  }

  return {
    // state
    ...store,

    // derived state
    edgesLayouted: getEdgesLayouted(store),
    connectionPath: getConnectionPath(store),
    markers: derived(
      [store.edges, store.defaultMarkerColor, store.flowId],
      ([edges, defaultColor, id]) => createMarkerIds(edges, { defaultColor, id })
    ),

    // actions
    setNodeTypes,
    setEdgeTypes,
    addEdge,
    updateNodePositions,
    updateNodeDimensions,
    zoomIn,
    zoomOut,
    fitView,
    setMinZoom,
    setMaxZoom,
    resetSelectedElements,
    addSelectedNodes,
    addSelectedEdges,
    panBy,
    updateConnection,
    cancelConnection,
    reset
  };
}

export function useStore(): SvelteFlowStore {
  const store = getContext<{ getStore: () => SvelteFlowStore }>(key);

  if (!store) {
    throw new Error(
      'In order to use useStore you need to wrap your component in a <SvelteFlowProvider />'
    );
  }

  return store.getStore();
}
