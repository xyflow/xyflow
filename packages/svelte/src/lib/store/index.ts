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
  type NodeDragItem,
  errorMessages
} from '@xyflow/system';

import { addEdge as addEdgeUtil } from '$lib/utils';
import type { EdgeTypes, NodeTypes, Node, Edge, FitViewOptions, ConnectionData } from '$lib/types';
import { initialEdgeTypes, initialNodeTypes, getInitialStore } from './initial-store';
import type { SvelteFlowStore } from './types';
import { syncNodeStores, syncEdgeStores, syncViewportStores } from './utils';
import { getEdgeTree } from './edge-tree';
import { getVisibleNodes } from './visible-nodes';
import { getDerivedConnectionProps } from './derived-connection-props';

export const key = Symbol();

export function createStore({
  nodes,
  edges,
  width,
  height,
  fitView: fitViewOnCreate
}: {
  nodes?: Node[];
  edges?: Edge[];
  width?: number;
  height?: number;
  fitView?: boolean;
}): SvelteFlowStore {
  const store = getInitialStore({ nodes, edges, width, height, fitView: fitViewOnCreate });

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
      return nds.map((node) => {
        const nodeDragItem = (nodeDragItems as Array<NodeBase | NodeDragItem>).find(
          (ndi) => ndi.id === node.id
        );

        if (nodeDragItem) {
          return {
            ...node,
            dragging,
            position: nodeDragItem.position,
            computed: {
              ...node.computed,
              positionAbsolute: nodeDragItem.computed?.positionAbsolute
            },
            [internalsSymbol]: node[internalsSymbol]
          };
        }

        return node;
      });
    });
  };

  function updateNodeDimensions(updates: Map<string, NodeDimensionUpdate>) {
    const nextNodes = updateNodeDimensionsSystem(
      updates,
      get(store.nodes),
      get(store.nodeLookup),
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

  function resetSelectedItem<T extends Node | Edge>(ids: string[]) {
    return (item: T) => {
      if (item.selected && ids.includes(item.id)) {
        return {
          ...item,
          selected: false
        };
      }

      return item;
    };
  }

  function unselectNodesAndEdges(params?: { nodes?: Node[]; edges?: Edge[] }) {
    const nodeIdsToUnselect = (params?.nodes ? params.nodes : get(store.nodes)).map(
      (item) => item.id
    );
    const edgeIdsToUnselect = (params?.edges ? params.edges : get(store.edges)).map(
      (item) => item.id
    );

    store.nodes.update((ns) => ns.map(resetSelectedItem(nodeIdsToUnselect)));
    store.edges.update((es) => es.map(resetSelectedItem(edgeIdsToUnselect)));
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
        get(store.ondelete)?.({
          nodes: matchingNodes,
          edges: matchingEdges
        });
      }
    }
  });

  function addSelectedNodes(ids: string[]) {
    const isMultiSelection = get(store.multiselectionKeyPressed);

    store.nodes.update((ns) =>
      ns.map((node) => {
        const nodeWillBeSelected = ids.includes(node.id);
        const selected = isMultiSelection
          ? node.selected || nodeWillBeSelected
          : nodeWillBeSelected;

        // we need to mutate the node here in order to have the correct selected state in the drag handler
        node.selected = selected;

        return node;
      })
    );

    if (!isMultiSelection) {
      store.edges.update((es) =>
        es.map((edge) => {
          edge.selected = false;
          return edge;
        })
      );
    }
  }

  function addSelectedEdges(ids: string[]) {
    const isMultiSelection = get(store.multiselectionKeyPressed);

    store.edges.update((edges) =>
      edges.map((edge) => {
        const edgeWillBeSelected = ids.includes(edge.id);
        const selected = isMultiSelection
          ? edge.selected || edgeWillBeSelected
          : edgeWillBeSelected;

        edge.selected = selected;

        return edge;
      })
    );

    if (!isMultiSelection) {
      store.nodes.update((ns) =>
        ns.map((node) => {
          node.selected = false;
          return node;
        })
      );
    }
  }

  function handleNodeSelection(id: string) {
    const node = get(store.nodes)?.find((n) => n.id === id);

    if (!node) {
      console.warn('012', errorMessages['error012'](id));
      return;
    }

    store.selectionRect.set(null);
    store.selectionRectMode.set(null);

    if (!node.selected) {
      addSelectedNodes([id]);
    } else if (node.selected && get(store.multiselectionKeyPressed)) {
      unselectNodesAndEdges({ nodes: [node], edges: [] });
    }
  }

  function panBy(delta: XYPosition) {
    const viewport = get(store.viewport);
    return panBySystem({
      delta,
      panZoom: get(store.panZoom),
      transform: [viewport.x, viewport.y, viewport.zoom],
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
    syncViewport: (viewport) => syncViewportStores(store.panZoom, store.viewport, viewport),
    setNodeTypes,
    setEdgeTypes,
    addEdge,
    updateNodePositions,
    updateNodeDimensions,
    zoomIn,
    zoomOut,
    fitView: (options?: FitViewOptions) => fitView(get(store.nodes), options),
    setMinZoom,
    setMaxZoom,
    setTranslateExtent,
    unselectNodesAndEdges,
    addSelectedNodes,
    addSelectedEdges,
    handleNodeSelection,
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

export function createStoreContext({
  nodes,
  edges,
  width,
  height,
  fitView
}: {
  nodes?: Node[];
  edges?: Edge[];
  width?: number;
  height?: number;
  fitView?: boolean;
}) {
  const store = createStore({ nodes, edges, width, height, fitView });

  setContext(key, {
    getStore: () => store
  });

  return store;
}
