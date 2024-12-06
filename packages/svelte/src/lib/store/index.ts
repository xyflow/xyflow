import { get } from 'svelte/store';
import {
  fitView as fitViewSystem,
  panBy as panBySystem,
  updateNodeInternals as updateNodeInternalsSystem,
  addEdge as addEdgeUtil,
  initialConnection,
  errorMessages,
  type UpdateNodePositions,
  type InternalNodeUpdate,
  type ViewportHelperFunctionOptions,
  type Connection,
  type XYPosition,
  type CoordinateExtent,
  type UpdateConnection,
  type ConnectionState,
  getFitViewNodes,
  updateAbsolutePositions,
  getDimensions
} from '@xyflow/system';

import type { EdgeTypes, NodeTypes, Node, Edge, FitViewOptions } from '$lib/types';
import { initialEdgeTypes, initialNodeTypes, getInitialStore } from './initial-store.svelte';
import { type StoreSignals, type SvelteFlowStore, type SvelteFlowStoreActions } from './types';
import { syncNodeStores, syncEdgeStores } from './utils';
// import { getVisibleEdges } from './visible-edges';
// import { getVisibleNodes } from './visible-nodes';

export const key = Symbol();

export { useStore } from './hook.svelte';

export function createStore(signals: StoreSignals): SvelteFlowStore {
  const store = getInitialStore(signals);

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
    for (const [id, dragItem] of nodeDragItems) {
      const node = store.nodeLookup.get(id)?.internals.userNode;

      if (!node) {
        continue;
      }

      node.position = dragItem.position;
      node.dragging = dragging;
    }

    store.nodes.update((nds) => nds);
  };

  function updateNodeInternals(updates: Map<string, InternalNodeUpdate>) {
    const { changes, updatedInternals } = updateNodeInternalsSystem(
      updates,
      store.nodeLookup,
      store.parentLookup,
      store.domNode,
      store.nodeOrigin
    );

    if (!updatedInternals) {
      return;
    }

    updateAbsolutePositions(store.nodeLookup, store.parentLookup, {
      nodeOrigin: store.nodeOrigin,
      nodeExtent: store.nodeExtent
    });

    if (!store.fitViewOnInitDone && store.fitViewOnInit) {
      const fitViewOnInitDone = fitViewSync({
        ...store.fitViewOptions,
        nodes: store.fitViewOptions?.nodes
      });
      store.fitViewOnInitDone = fitViewOnInitDone;
    }

    for (const change of changes) {
      const node = store.nodeLookup.get(change.id)?.internals.userNode;

      if (!node) {
        continue;
      }

      switch (change.type) {
        case 'dimensions': {
          const measured = { ...node.measured, ...change.dimensions };

          if (change.setAttributes) {
            node.width = change.dimensions?.width ?? node.width;
            node.height = change.dimensions?.height ?? node.height;
          }

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
    const domNode = store.domNode;

    if (!panZoom || !domNode) {
      return Promise.resolve(false);
    }

    const { width, height } = getDimensions(domNode);

    const fitViewNodes = getFitViewNodes(store.nodeLookup, options);

    return fitViewSystem(
      {
        nodes: fitViewNodes,
        width,
        height,
        minZoom: store.minZoom,
        maxZoom: store.maxZoom,
        panZoom
      },
      options
    );
  }

  function fitViewSync(options?: FitViewOptions) {
    const panZoom = store.panZoom;

    if (!panZoom) {
      return false;
    }

    const fitViewNodes = getFitViewNodes(store.nodeLookup, options);

    fitViewSystem(
      {
        nodes: fitViewNodes,
        width: store.width,
        height: store.height,
        minZoom: store.minZoom,
        maxZoom: store.maxZoom,
        panZoom
      },
      options
    );

    return fitViewNodes.size > 0;
  }

  function zoomBy(factor: number, options?: ViewportHelperFunctionOptions) {
    const panZoom = store.panZoom;
    if (!panZoom) {
      return Promise.resolve(false);
    }

    return panZoom.scaleBy(factor, options);
  }

  function zoomIn(options?: ViewportHelperFunctionOptions) {
    return zoomBy(1.2, options);
  }

  function zoomOut(options?: ViewportHelperFunctionOptions) {
    return zoomBy(1 / 1.2, options);
  }

  function setMinZoom(minZoom: number) {
    const panZoom = store.panZoom;

    if (panZoom) {
      panZoom.setScaleExtent([minZoom, store.maxZoom]);
      store.minZoom = minZoom;
    }
  }

  function setMaxZoom(maxZoom: number) {
    const panZoom = store.panZoom;

    if (panZoom) {
      panZoom.setScaleExtent([store.minZoom, maxZoom]);
      store.maxZoom = maxZoom;
    }
  }

  function setTranslateExtent(extent: CoordinateExtent) {
    const panZoom = store.panZoom;

    if (panZoom) {
      panZoom.setTranslateExtent(extent);
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

  function setPaneClickDistance(distance: number) {
    store.panZoom?.setClickDistance(distance);
  }

  function unselectNodesAndEdges(params?: { nodes?: Node[]; edges?: Edge[] }) {
    const resetNodes = resetSelectedElements(params?.nodes || get(store.nodes));
    if (resetNodes) store.nodes.set(get(store.nodes));

    const resetEdges = resetSelectedElements(params?.edges || get(store.edges));
    if (resetEdges) store.edges.set(get(store.edges));
  }

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
    return panBySystem({
      delta,
      panZoom: store.panZoom,
      transform: [store.viewport.x, store.viewport.y, store.viewport.zoom],
      translateExtent: store.translateExtent,
      width: store.width,
      height: store.height
    });
  }

  // const _connection = writable<ConnectionState>(initialConnection);
  const updateConnection: UpdateConnection = (newConnection: ConnectionState) => {
    store.rawConnection = { ...newConnection };
  };

  function cancelConnection() {
    store.rawConnection = initialConnection;
  }

  function reset() {
    store.fitViewOnInitDone = false;
    store.selectionRect = null;
    store.selectionRectMode = null;

    unselectNodesAndEdges();
    cancelConnection();
  }

  const storeWithActions = Object.assign(store, {
    syncNodeStores: (nodes) => syncNodeStores(store.nodes, nodes),
    syncEdgeStores: (edges) => syncEdgeStores(store.edges, edges),
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
    setPaneClickDistance,
    unselectNodesAndEdges,
    addSelectedNodes,
    addSelectedEdges,
    handleNodeSelection,
    panBy,
    updateConnection,
    cancelConnection,
    reset
  } satisfies SvelteFlowStoreActions);

  return storeWithActions;

  // return {
  //   // state
  //   ...store,

  //   // derived state
  //   // visibleEdges: getVisibleEdges(store),
  //   // visibleNodes: getVisibleNodes(store),
  //   // connection: derived([_connection, store.viewport], ([connection, viewport]) => {
  //   //   return connection.inProgress
  //   //     ? {
  //   //         ...connection,
  //   //         to: pointToRendererPoint(connection.to, [viewport.x, viewport.y, viewport.zoom])
  //   //       }
  //   //     : { ...connection };
  //   // }),
  //   // markers: derived(
  //   //   [store.edges, store.defaultMarkerColor, store.flowId],
  //   //   ([edges, defaultColor, id]) => createMarkerIds(edges, { defaultColor, id })
  //   // ),
  //   // initialized: (() => {
  //   //   let initialized = false;
  //   //   const initialNodesLength = get(store.nodes).length;
  //   //   const initialEdgesLength = get(store.edges).length;
  //   //   return derived(
  //   //     [store.nodesInitialized, store.edgesInitialized, store.viewportInitialized],
  //   //     ([nodesInitialized, edgesInitialized, viewportInitialized]) => {
  //   //       // If it was already initialized, return true from then on
  //   //       if (initialized) return initialized;

  //   //       // if it hasn't been initialised check if it's now
  //   //       if (initialNodesLength === 0) {
  //   //         initialized = viewportInitialized;
  //   //       } else if (initialEdgesLength === 0) {
  //   //         initialized = viewportInitialized && nodesInitialized;
  //   //       } else {
  //   //         initialized = viewportInitialized && nodesInitialized && edgesInitialized;
  //   //       }

  //   //       return initialized;
  //   //     }
  //   //   );
  //   // })(),

  //   // actions
  //   syncNodeStores: (nodes) => syncNodeStores(store.nodes, nodes),
  //   syncEdgeStores: (edges) => syncEdgeStores(store.edges, edges),
  //   // syncViewport: (viewport) => syncViewportStores(store.panZoom, store.viewport, viewport),
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
  //   setPaneClickDistance,
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
