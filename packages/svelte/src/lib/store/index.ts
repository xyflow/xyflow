import { getContext, setContext } from 'svelte';
import { derived, get, writable } from 'svelte/store';
import {
  internalsSymbol,
  createMarkerIds,
  fitView as fitViewUtil,
  getElementsToRemove,
  panBy as panBySystem,
  updateNodeDimensions as updateNodeDimensionsSystem,
  type UpdateNodePositions,
  type NodeDimensionUpdate,
  type ViewportHelperFunctionOptions,
  type Connection,
  type XYPosition,
  type CoordinateExtent,
  type UpdateConnection,
  type NodeBase,
  type NodeDragItem
} from '@xyflow/system';

import { addEdge as addEdgeUtil } from '$lib/utils';
import type { EdgeTypes, NodeTypes, Node, Edge, FitViewOptions, ConnectionData } from '$lib/types';
import { initialEdgeTypes, initialNodeTypes, getInitialStore } from './initial-store';
import type { SvelteFlowStore } from './types';
import { syncNodeStores, syncEdgeStores } from './utils';
import { getEdgeTree } from './edge-tree';
import { getVisibleNodes } from './visible-nodes';
import { getDerivedConnectionProps } from './derived-connection-props';

export const key = Symbol();

export function createStore(): SvelteFlowStore {
  const store = getInitialStore();

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

  const updateNodePositions: UpdateNodePositions = (nodeDragItems, dragging = false) => {
    store.nodes.update((nds) => {
      return nds.map((n) => {
        const nodeDragItem = (nodeDragItems as Array<NodeBase | NodeDragItem>).find(
          (ndi) => ndi.id === n.id
        );

        if (nodeDragItem) {
          return {
            ...n,
            [internalsSymbol]: n[internalsSymbol],
            dragging,
            positionAbsolute: nodeDragItem.positionAbsolute,
            position: nodeDragItem.position
          };
        }

        return n;
      });
    });
  };

  function updateNodeDimensions(updates: NodeDimensionUpdate[]) {
    const nextNodes = updateNodeDimensionsSystem(
      updates,
      get(store.nodes),
      get(store.domNode),
      get(store.nodeOrigin)
    );

    if (!nextNodes) {
      return;
    }

    if (!get(store.fitViewOnInitDone) && get(store.fitViewOnInit)) {
      const fitViewOptions = get(store.fitViewOptions);
      const fitViewOnInitDone = fitView(nextNodes, {
        ...fitViewOptions,
        nodes: fitViewOptions?.nodes || nextNodes
      });
      store.fitViewOnInitDone.set(fitViewOnInitDone);
    }

    store.nodes.set(nextNodes);
  }

  function fitView(nodes: Node[], options?: FitViewOptions) {
    const panZoom = get(store.panZoom);

    if (!panZoom) {
      return false;
    }

    return fitViewUtil(
      {
        nodes,
        width: get(store.width),
        height: get(store.height),
        minZoom: get(store.minZoom),
        maxZoom: get(store.maxZoom),
        panZoom,
        nodeOrigin: get(store.nodeOrigin)
      },
      options
    );
  }

  function zoomBy(factor: number, options?: ViewportHelperFunctionOptions) {
    const panZoom = get(store.panZoom);

    if (panZoom) {
      panZoom.scaleBy(factor, options);
    }
  }

  function zoomIn(options?: ViewportHelperFunctionOptions) {
    zoomBy(1.2, options);
  }

  function zoomOut(options?: ViewportHelperFunctionOptions) {
    zoomBy(1 / 1.2, options);
  }

  function setMinZoom(minZoom: number) {
    const panZoom = get(store.panZoom);

    if (panZoom) {
      panZoom.setScaleExtent([minZoom, get(store.maxZoom)]);
      store.minZoom.set(minZoom);
    }
  }

  function setMaxZoom(maxZoom: number) {
    const panZoom = get(store.panZoom);

    if (panZoom) {
      panZoom.setScaleExtent([get(store.minZoom), maxZoom]);
      store.maxZoom.set(maxZoom);
    }
  }

  function setTranslateExtent(extent: CoordinateExtent) {
    const panZoom = get(store.panZoom);

    if (panZoom) {
      panZoom.setTranslateExtent(extent);
      store.translateExtent.set(extent);
    }
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

  function unselectNodesAndEdges() {
    if (get(store.nodes).some((node) => node.selected)) {
      store.nodes.update((ns) => ns.map(resetSelectedItem));
    }

    if (get(store.edges).some((edge) => edge.selected)) {
      store.edges.update((es) => es.map(resetSelectedItem));
    }
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
    return panBySystem({
      delta,
      panZoom: get(store.panZoom),
      transform: get(store.transform),
      translateExtent: get(store.translateExtent),
      width: get(store.width),
      height: get(store.height)
    });
  }

  const initConnectionUpdateData = {
    connectionStartHandle: null,
    connectionEndHandle: null,
    connectionPosition: null,
    connectionStatus: null
  };

  // by creating an internal, unexposed store and using a derived store
  // we prevent using slow get() calls
  const currentConnection = writable<ConnectionData>(initConnectionUpdateData);
  const updateConnection: UpdateConnection = (newConnection: ConnectionData) => {
    currentConnection.set(newConnection);
  };

  function cancelConnection() {
    updateConnection(initConnectionUpdateData);
  }

  function reset() {
    store.fitViewOnInitDone.set(false);
    store.selectionRect.set(null);
    store.selectionRectMode.set(null);
    store.snapGrid.set(null);
    store.isValidConnection.set(() => true);
    store.nodes.set([]);
    store.edges.set([]);

    unselectNodesAndEdges();
    cancelConnection();
  }

  return {
    // state
    ...store,

    // derived state
    edgeTree: getEdgeTree(store),
    connection: getDerivedConnectionProps(store, currentConnection),
    visibleNodes: getVisibleNodes(store),
    markers: derived(
      [store.edges, store.defaultMarkerColor, store.flowId],
      ([edges, defaultColor, id]) => createMarkerIds(edges, { defaultColor, id })
    ),

    // actions
    syncNodeStores: (nodes) => syncNodeStores(store.nodes, nodes),
    syncEdgeStores: (edges) => syncEdgeStores(store.edges, edges),
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
    setTranslateExtent,
    unselectNodesAndEdges,
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

export function createStoreContext() {
  const store = createStore();

  setContext(key, {
    getStore: () => store
  });

  return store;
}
