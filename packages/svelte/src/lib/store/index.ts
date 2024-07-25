import { getContext, setContext } from 'svelte';
import { derived, get, writable } from 'svelte/store';
import {
  createMarkerIds,
  fitView as fitViewSystem,
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
import { initialEdgeTypes, initialNodeTypes, getInitialStore } from './initial-store';
import type { SvelteFlowStore, SvelteFlowStoreActions, SvelteFlowStoreState } from './types';

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
    store.setNodes((nodes) =>
      nodes.map((node) => {
        const dragItem = nodeDragItems.get(node.id);
        if (dragItem) {
          return {
            ...node,
            position: { ...dragItem.position },
            dragging
          };
        }
        return node;
      })
    );
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
          if (change.setAttributes) {
            if (change.dimensions?.width) node.width = change.dimensions.width;
            if (change.dimensions?.height) node.height = change.dimensions.height;
          }
          node.measured = measured;
          break;
        }
        case 'position':
          node.position = change.position ?? node.position;
          break;
      }
    }

    if (!store.nodesInitialized) {
      store.nodesInitialized = true;
    }

    store.setNodes((nodes) => nodes.map((node) => ({ ...node })));
  }

  function fitView(options?: FitViewOptions) {
    const panZoom = store.panZoom;

    if (!panZoom) {
      return false;
    }

    return fitViewSystem(
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
        if (node.internals.userNode.selected) {
          node.internals.userNode.selected = false;
        }
      } else {
        if (node.selected) {
          node.selected = false;
        }
      }
    }
  }

  function unselectNodesAndEdges(params?: { nodes?: Node[]; edges?: Edge[] }) {
    resetSelectedNodes(params?.nodes ?? store.selectedNodes.values());

    resetSelectedEdges(params?.edges ?? store.selectedEdges.values());
  }

  function addSelectedNodes(ids: string[]) {
    const isMultiSelection = store.multiselectionKeyPressed;

    store.setNodes((nodes) =>
      nodes.map((node) => {
        const nodeWillBeSelected = ids.includes(node.id);
        const selected = isMultiSelection
          ? node.selected || nodeWillBeSelected
          : nodeWillBeSelected;

        // we need to mutate the node here in order to have the correct selected state in the drag handler
        // node.selected = selected;
        if (!!node.selected !== selected) {
          return {
            ...node,
            selected: selected
          };
        }
        return node;

        // if (!isMultiSelection) {
        //   for (const edge of store.edgeLookup.values()) {
        //     edge.selected = false;
        //   }
        // }
      })
    );
  }

  function addSelectedEdges(ids: string[]) {
    const isMultiSelection = store.multiselectionKeyPressed;

    for (const edge of store.edgeLookup.values()) {
      const edgeWillBeSelected = ids.includes(edge.id);
      const selected = isMultiSelection ? edge.selected || edgeWillBeSelected : edgeWillBeSelected;

      if (!!edge.selected !== selected) {
        edge.selected = selected;
      }
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

    // TODO: clear all maps in the store
  }

  const storeWithAction = Object.assign<SvelteFlowStoreState, SvelteFlowStoreActions>(store, {
    // TODO: markers and stuff
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
