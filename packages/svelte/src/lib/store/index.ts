import { getContext, setContext } from 'svelte';
import { derived, get, writable } from 'svelte/store';
import {
  createMarkerIds,
  fitView as fitViewUtil,
  getElementsToRemove,
  panBy as panBySystem,
  updateNodeInternals as updateNodeInternalsSystem,
  addEdge as addEdgeUtil,
  type UpdateNodePositions,
  type InternalNodeUpdate,
  type ViewportHelperFunctionOptions,
  type Connection,
  type XYPosition,
  type CoordinateExtent,
  type UpdateConnection,
  errorMessages,
  isInternalNodeBase
} from '@xyflow/system';

import type {
  EdgeTypes,
  NodeTypes,
  Node,
  Edge,
  FitViewOptions,
  ConnectionData,
  InternalNode
} from '$lib/types';
import { initialEdgeTypes, initialNodeTypes, getInitialStore } from './initial-store.svelte';
import type { SvelteFlowStore, SvelteFlowStoreActions, SvelteFlowStoreState } from './types';
import { syncNodeStores, syncEdgeStores, syncViewportStores } from './utils';
// import { getVisibleEdges } from './visible-edges';
// import { getVisibleNodes } from './visible-nodes';
// import { getDerivedConnectionProps } from './derived-connection-props';
// import { derivedSignal } from './signals.svelte';

export const key = Symbol();

export function createStore(): SvelteFlowStore {
  const store = getInitialStore();

  function setNodeTypes(nodeTypes: NodeTypes) {
    store.nodeTypes = {
      ...initialNodeTypes,
      ...nodeTypes
    };
  }

  function setEdgeTypes(edgeTypes: EdgeTypes) {
    store.edgeTypes = {
      ...initialEdgeTypes,
      ...edgeTypes
    };
  }

  function addEdge(edgeParams: Edge | Connection) {
    addEdgeUtil(edgeParams, store.edges, true);
  }

  const updateNodePositions: UpdateNodePositions = (nodeDragItems, dragging = false) => {
    for (const [id, dragItem] of nodeDragItems) {
      const node = store.nodeLookup.get(id)?.internals.userNode;

      if (!node) {
        continue;
      }

      node.position = dragItem.position;
      node.dragging = dragging;
    }
  };

  function updateNodeInternals(updates: Map<string, InternalNodeUpdate>) {
    const nodeLookup = store.nodeLookup;
    const { changes, updatedInternals } = updateNodeInternalsSystem(
      updates,
      nodeLookup,
      store.parentLookup,
      store.domNode,
      store.nodeOrigin
    );

    if (!updatedInternals) {
      return;
    }

    if (!store.fitViewOnInitDone && store.fitViewOnInit) {
      const fitViewOptions = store.fitViewOptions;
      const fitViewOnInitDone = fitView({
        ...fitViewOptions,
        nodes: fitViewOptions?.nodes
      });
      store.fitViewOnInitDone = fitViewOnInitDone;
    }

    for (const change of changes) {
      const node = nodeLookup.get(change.id)?.internals.userNode;
      const internalNode = nodeLookup.get(change.id)!;

      if (!node) {
        continue;
      }

      switch (change.type) {
        case 'dimensions': {
          const measured = { ...node.measured, ...change.dimensions };
          node.width = change.dimensions?.width ?? node.width;
          node.height = change.dimensions?.height ?? node.height;
          internalNode.internals.userNode.measured = measured;
          break;
        }
        case 'position':
          node.position = change.position ?? node.position;
          break;
      }
    }

    // store.nodes.update((nds) => nds);

    if (!store.nodesInitialized) {
      store.nodesInitialized = true;
    }
  }

  function fitView(options?: FitViewOptions) {
    const panZoom = store.panZoom;

    if (!panZoom) {
      return false;
    }

    return fitViewUtil(
      {
        nodeLookup: store.nodeLookup,
        width: store.width,
        height: store.height,
        minZoom: store.minZoom,
        maxZoom: store.maxZoom,
        panZoom,
        nodeOrigin: store.nodeOrigin
      },
      options
    );
  }

  function zoomBy(factor: number, options?: ViewportHelperFunctionOptions) {
    if (store.panZoom) {
      store.panZoom.scaleBy(factor, options);
    }
  }

  function zoomIn(options?: ViewportHelperFunctionOptions) {
    zoomBy(1.2, options);
  }

  function zoomOut(options?: ViewportHelperFunctionOptions) {
    zoomBy(1 / 1.2, options);
  }

  function setMinZoom(minZoom: number) {
    if (store.panZoom) {
      store.panZoom.setScaleExtent([minZoom, store.maxZoom]);
      store.minZoom = minZoom;
    }
  }

  function setMaxZoom(maxZoom: number) {
    if (store.panZoom) {
      store.panZoom.setScaleExtent([store.minZoom, maxZoom]);
      store.maxZoom = maxZoom;
    }
  }

  function setTranslateExtent(extent: CoordinateExtent) {
    if (store.panZoom) {
      store.panZoom.setTranslateExtent(extent);
      store.translateExtent = extent;
    }
  }

  function resetSelectedEdges(edges: Edge[] | IterableIterator<Edge>) {
    for (const edge of edges) {
      if (edge.selected) {
        edge.selected = false;
      }
    }
  }

  function resetSelectedNodes(nodes: Node[] | IterableIterator<InternalNode>): void {
    for (const node of nodes) {
      if (isInternalNodeBase(node)) {
        node.internals.userNode.selected = false;
      } else {
        node.selected = false;
      }
    }
  }

  function unselectNodesAndEdges(params?: { nodes?: Node[]; edges?: Edge[] }) {
    resetSelectedNodes(params?.nodes ?? store.nodeLookup.values());

    resetSelectedEdges(params?.edges ?? store.edgeLookup.values());
  }

  function addSelectedNodes(ids: string[]) {
    const isMultiSelection = store.multiselectionKeyPressed;

    for (const node of store.nodeLookup.values()) {
      const nodeWillBeSelected = ids.includes(node.id);
      const selected = isMultiSelection
        ? node.internals.userNode.selected || nodeWillBeSelected
        : nodeWillBeSelected;

      // we need to mutate the node here in order to have the correct selected state in the drag handler
      // node.selected = selected;
      node.internals.userNode.selected = selected;
    }

    if (!isMultiSelection) {
      for (const edge of store.edges) {
        edge.selected = false;
      }
    }
  }

  function addSelectedEdges(ids: string[]) {
    const isMultiSelection = store.multiselectionKeyPressed;

    for (const edge of store.edges) {
      const edgeWillBeSelected = ids.includes(edge.id);
      const selected = isMultiSelection ? edge.selected || edgeWillBeSelected : edgeWillBeSelected;

      edge.selected = selected;
    }

    if (!isMultiSelection) {
      for (const node of store.nodeLookup.values()) {
        node.internals.userNode.selected = false;
      }
    }
  }

  function handleNodeSelection(id: string) {
    const node = store.nodeLookup.get(id)?.internals.userNode;

    if (!node) {
      console.warn('012', errorMessages['error012'](id));
      return;
    }

    store.selectionRect = null;
    store.selectionRectMode = null;

    if (!node.selected) {
      addSelectedNodes([id]);
    } else if (node.selected && store.multiselectionKeyPressed) {
      unselectNodesAndEdges({ nodes: [node], edges: [] });
    }
  }

  function panBy(delta: XYPosition) {
    const viewport = store.viewport;
    return panBySystem({
      delta,
      panZoom: store.panZoom,
      transform: [viewport.x, viewport.y, viewport.zoom],
      translateExtent: store.translateExtent,
      width: store.width,
      height: store.height
    });
  }

  const initConnectionUpdateData = {
    connectionStartHandle: null,
    connectionEndHandle: null,
    connectionPosition: null,
    connectionStatus: null
  };

  const updateConnection: UpdateConnection = (newConnection: ConnectionData) => {
    store.connectionData = newConnection;
  };

  function cancelConnection() {
    updateConnection(initConnectionUpdateData);
  }

  function reset() {
    store.fitViewOnInitDone = false;
    store.selectionRect = null;
    store.selectionRectMode = null;
    store.snapGrid = null;
    store.isValidConnection = () => true;

    unselectNodesAndEdges();
    cancelConnection();
  }

  const storeWithAction = Object.assign<SvelteFlowStoreState, SvelteFlowStoreActions>(store, {
    // visibleEdges: derivedSignal(() => get(store.edges)),
    // // visibleNodes: getVisibleNodes(store),
    // visibleNodes: derivedSignal(() => {
    //   // TODO: this does not work yet
    //   const transform: Transform = [
    //     get(store.viewport).x,
    //     get(store.viewport).y,
    //     get(store.viewport).zoom
    //   ];

    //   return store.onlyRenderVisibleElements
    //     ? getNodesInside(
    //         store.nodeLookup,
    //         { x: 0, y: 0, width: store.width, height: store.height },
    //         transform,
    //         true
    //       )
    //     : Array.from(store.nodeLookup.values());
    // }),
    // markers: derivedSignal(() =>
    //   createMarkerIds(get(store.edges), { defaultColor: store.defaultMarkerColor, id: store.flowId })
    // ),
    // initialized: (() => {
    //   let initialized = false;
    //   const initialNodesLength = get(store.nodes).length;
    //   const initialEdgesLength = get(store.edges).length;
    //   return derivedSignal(() => {
    //     // If it was already initialized, return true from then on
    //     if (initialized) return initialized;

    //     // if it hasn't been initialised check if it's now
    //     if (initialNodesLength === 0) {
    //       initialized = store.viewportInitialized;
    //     } else if (initialEdgesLength === 0) {
    //       initialized = store.viewportInitialized && store.nodesInitialized;
    //     } else {
    //       initialized =
    //         store.viewportInitialized && store.nodesInitialized && store.edgesInitialized;
    //     }

    //     return initialized;
    //   });
    // })(),
    // actions
    // syncNodeStores: (nodes) => syncNodeStores(store.nodes, nodes),
    // syncEdgeStores: (edges) => syncEdgeStores(store.edges, edges),
    // syncViewport: (viewport) => syncViewportStores(store.panZoom, store.viewport, viewport),
    setNodeTypes,
    setEdgeTypes,
    addEdge,
    updateNodePositions,
    updateNodeInternals,
    zoomIn,
    zoomOut,
    fitView: (options?: FitViewOptions) => fitView(options),
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
  } satisfies SvelteFlowStoreActions);

  return storeWithAction;

  // return {
  //   // state
  //   ...store,

  //   // derived state
  //   connection: getDerivedConnectionProps(store, currentConnection),
  //   visibleEdges: getVisibleEdges(store),
  //   visibleNodes: getVisibleNodes(store),
  //   markers: derived(
  //     [store.edges, store.defaultMarkerColor, store.flowId],
  //     ([edges, defaultColor, id]) => createMarkerIds(edges, { defaultColor, id })
  //   ),
  //   initialized: (() => {
  //     let initialized = false;
  //     const initialNodesLength = get(store.nodes).length;
  //     const initialEdgesLength = get(store.edges).length;
  //     return derived(
  //       [store.nodesInitialized, store.edgesInitialized, store.viewportInitialized],
  //       ([nodesInitialized, edgesInitialized, viewportInitialized]) => {
  //         // If it was already initialized, return true from then on
  //         if (initialized) return initialized;

  //         // if it hasn't been initialised check if it's now
  //         if (initialNodesLength === 0) {
  //           initialized = viewportInitialized;
  //         } else if (initialEdgesLength === 0) {
  //           initialized = viewportInitialized && nodesInitialized;
  //         } else {
  //           initialized = viewportInitialized && nodesInitialized && edgesInitialized;
  //         }

  //         return initialized;
  //       }
  //     );
  //   })(),

  //   // actions
  //   syncNodeStores: (nodes) => syncNodeStores(store.nodes, nodes),
  //   syncEdgeStores: (edges) => syncEdgeStores(store.edges, edges),
  //   syncViewport: (viewport) => syncViewportStores(store.panZoom, store.viewport, viewport),
  //   setNodeTypes,
  //   setEdgeTypes,
  //   addEdge,
  //   updateNodePositions,
  //   updateNodeInternals,
  //   zoomIn,
  //   zoomOut,
  //   fitView: (options?: FitViewOptions) => fitView(options),
  //   setMinZoom,
  //   setMaxZoom,
  //   setTranslateExtent,
  //   unselectNodesAndEdges,
  //   addSelectedNodes,
  //   addSelectedEdges,
  //   handleNodeSelection,
  //   panBy,
  //   updateConnection,
  //   cancelConnection,
  //   reset
  // };
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
