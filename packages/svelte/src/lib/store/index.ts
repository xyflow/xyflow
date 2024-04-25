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
  errorMessages
} from '@xyflow/system';

import type { EdgeTypes, NodeTypes, Node, Edge, FitViewOptions, ConnectionData } from '$lib/types';
import { initialEdgeTypes, initialNodeTypes, getInitialStore } from './initial-store.svelte';
import type { SvelteFlowStore, SvelteFlowStoreActions, SvelteFlowStoreState } from './types';
import { syncNodeStores, syncEdgeStores, syncViewportStores } from './utils';
// import { getVisibleEdges } from './visible-edges';
// import { getVisibleNodes } from './visible-nodes';
// import { getDerivedConnectionProps } from './derived-connection-props';
// import { derivedSignal } from './signals.svelte';

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
    const edges = get(store.edges);
    store.edges.set(addEdgeUtil(edgeParams, edges));
  }

  const updateNodePositions: UpdateNodePositions = (nodeDragItems, dragging = false) => {
    const nodeLookup = store.nodeLookup;

    for (const [id, dragItem] of nodeDragItems) {
      const node = nodeLookup.get(id)?.internals.userNode;

      if (!node) {
        continue;
      }

      node.position = dragItem.position;
      node.dragging = dragging;
    }

    store.nodes.update((nds) => nds);
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

      if (!node) {
        continue;
      }

      switch (change.type) {
        case 'dimensions': {
          const measured = { ...node.measured, ...change.dimensions };
          node.width = change.dimensions?.width ?? node.width;
          node.height = change.dimensions?.height ?? node.height;
          node.measured = measured;
          break;
        }
        case 'position':
          node.position = change.position ?? node.position;
          break;
      }
    }

    store.nodes.update((nds) => nds);

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

  function resetSelectedElements(elements: Node[] | Edge[]) {
    let elementsChanged = false;
    elements.forEach((element) => {
      if (element.selected) {
        element.selected = false;
        elementsChanged = true;
      }
    });
    return elementsChanged;
  }

  function unselectNodesAndEdges(params?: { nodes?: Node[]; edges?: Edge[] }) {
    const resetNodes = resetSelectedElements(params?.nodes || get(store.nodes));
    if (resetNodes) store.nodes.update((nds) => nds);

    const resetEdges = resetSelectedElements(params?.edges || get(store.edges));
    if (resetEdges) store.edges.update((nds) => nds);
  }

  //TODO: find a good solutio, maybe this shouldnt even be here
  // store.deleteKeyPressed.subscribe(async (deleteKeyPressed) => {
  //   if (deleteKeyPressed) {
  //     const nodes = get(store.nodes);
  //     const edges = get(store.edges);
  //     const selectedNodes = nodes.filter((node) => node.selected);
  //     const selectedEdges = edges.filter((edge) => edge.selected);

  //     const { nodes: matchingNodes, edges: matchingEdges } = await getElementsToRemove({
  //       nodesToRemove: selectedNodes,
  //       edgesToRemove: selectedEdges,
  //       nodes,
  //       edges,
  //       onBeforeDelete: store.onbeforedelete
  //     });

  //     if (matchingNodes.length || matchingEdges.length) {
  //       store.nodes.update((nds) =>
  //         nds.filter((node) => !matchingNodes.some((mN) => mN.id === node.id))
  //       );
  //       store.edges.update((eds) =>
  //         eds.filter((edge) => !matchingEdges.some((mE) => mE.id === edge.id))
  //       );

  //       store.ondelete?.({
  //         nodes: matchingNodes,
  //         edges: matchingEdges
  //       });
  //     }
  //   }
  // });

  function addSelectedNodes(ids: string[]) {
    const isMultiSelection = store.multiselectionKeyPressed;

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
    const isMultiSelection = store.multiselectionKeyPressed;

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
      transform: [get(viewport).x, get(viewport).y, get(viewport).zoom],
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
    store.fitViewOnInitDone = false;
    store.selectionRect = null;
    store.selectionRectMode = null;
    store.snapGrid = null;
    store.isValidConnection = () => true;

    unselectNodesAndEdges();
    cancelConnection();
  }

  const storeWithAction = Object.assign<SvelteFlowStoreState, SvelteFlowStoreActions>(store, {
    // // connection: getDerivedConnectionProps(store, currentConnection),
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
    syncNodeStores: (nodes) => syncNodeStores(store.nodes, nodes),
    syncEdgeStores: (edges) => syncEdgeStores(store.edges, edges),
    syncViewport: (viewport) => syncViewportStores(store.panZoom, store.viewport, viewport),
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
