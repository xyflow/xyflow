import {
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
  updateAbsolutePositions,
  snapPosition,
  calculateNodePosition,
  type SetCenterOptions,
  getHandlePosition,
  Position
} from '@xyflow/system';

import type { EdgeTypes, NodeTypes, Node, Edge, FitViewOptions } from '$lib/types';
import { initialEdgeTypes, initialNodeTypes, getInitialStore } from './initial-store.svelte';
import { type StoreSignals, type SvelteFlowStore, type SvelteFlowStoreActions } from './types';

export const key = Symbol();

export { useStore } from '../hooks/useStore';

export function createStore<NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  signals: StoreSignals<NodeType, EdgeType>
): SvelteFlowStore<NodeType, EdgeType> {
  const store = getInitialStore<NodeType, EdgeType>(signals);

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

  function addEdge(edgeParams: EdgeType | Connection) {
    store.edges = addEdgeUtil<EdgeType>(edgeParams, store.edges);
  }

  const updateNodePositions: UpdateNodePositions = (nodeDragItems, dragging = false) => {
    store.nodes = store.nodes.map((node) => {
      if (store.connection.inProgress && store.connection.fromNode.id === node.id) {
        const internalNode = store.nodeLookup.get(node.id);
        if (internalNode) {
          store.connection = {
            ...store.connection,
            from: getHandlePosition(internalNode, store.connection.fromHandle, Position.Left, true)
          };
        }
      }
      const dragItem = nodeDragItems.get(node.id);
      return dragItem ? { ...node, position: dragItem.position, dragging } : node;
    });
  };

  function updateNodeInternals(updates: Map<string, InternalNodeUpdate>) {
    const { changes, updatedInternals } = updateNodeInternalsSystem(
      updates,
      store.nodeLookup,
      store.parentLookup,
      store.domNode,
      store.nodeOrigin,
      store.nodeExtent,
      store.zIndexMode
    );

    if (!updatedInternals) {
      return;
    }

    updateAbsolutePositions(store.nodeLookup, store.parentLookup, {
      nodeOrigin: store.nodeOrigin,
      nodeExtent: store.nodeExtent,
      zIndexMode: store.zIndexMode
    });

    if (store.fitViewQueued) {
      store.resolveFitView();
    }

    const newNodes = new Map<string, NodeType>();
    for (const change of changes) {
      const userNode = store.nodeLookup.get(change.id)?.internals.userNode;

      if (!userNode) {
        continue;
      }

      const node = { ...userNode };

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

      newNodes.set(change.id, node);
    }

    store.nodes = store.nodes.map((node) => newNodes.get(node.id) ?? node);
  }

  function fitView(options?: FitViewOptions) {
    // We either create a new Promise or reuse the existing one
    // Even if fitView is called multiple times in a row, we only end up with a single Promise
    const fitViewResolver = store.fitViewResolver ?? Promise.withResolvers<boolean>();

    // We schedule a fitView by setting fitViewQueued and triggering a setNodes
    store.fitViewQueued = true;
    store.fitViewOptions = options;
    store.fitViewResolver = fitViewResolver;

    // We need to update the nodes so that adoptUserNodes is triggered
    store.nodes = [...store.nodes];

    return fitViewResolver.promise;
  }

  async function setCenter(x: number, y: number, options?: SetCenterOptions) {
    const nextZoom = typeof options?.zoom !== 'undefined' ? options.zoom : store.maxZoom;
    const currentPanZoom = store.panZoom;

    if (!currentPanZoom) {
      return Promise.resolve(false);
    }

    await currentPanZoom.setViewport(
      {
        x: store.width / 2 - x * nextZoom,
        y: store.height / 2 - y * nextZoom,
        zoom: nextZoom
      },
      { duration: options?.duration, ease: options?.ease, interpolate: options?.interpolate }
    );

    return Promise.resolve(true);
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

  function deselect<T extends Node | Edge>(
    elements: T[],
    elementsToDeselect: Set<string> | null = null
  ): [boolean, T[]] {
    let deselected = false;

    const newElements = elements.map((element) => {
      const shouldDeselect = elementsToDeselect ? elementsToDeselect.has(element.id) : true;

      if (shouldDeselect && element.selected) {
        deselected = true;
        return { ...element, selected: false };
      }
      return element;
    });

    return [deselected, newElements];
  }

  function unselectNodesAndEdges(params?: { nodes?: Node[]; edges?: Edge[] }) {
    const nodesToDeselect = params?.nodes ? new Set(params.nodes.map((node) => node.id)) : null;
    const [nodesDeselected, newNodes] = deselect(store.nodes, nodesToDeselect);
    if (nodesDeselected) {
      store.nodes = newNodes;
    }

    const edgesToDeselect = params?.edges ? new Set(params.edges.map((node) => node.id)) : null;
    const [edgesDeselected, newEdges] = deselect(store.edges, edgesToDeselect);
    if (edgesDeselected) {
      store.edges = newEdges;
    }
  }

  function addSelectedNodes(ids: string[]) {
    const isMultiSelection = store.multiselectionKeyPressed;

    store.nodes = store.nodes.map((node) => {
      const nodeWillBeSelected = ids.includes(node.id);
      const selected = isMultiSelection ? node.selected || nodeWillBeSelected : nodeWillBeSelected;

      if (!!node.selected !== selected) {
        return { ...node, selected };
      }
      return node;
    });

    if (!isMultiSelection) {
      unselectNodesAndEdges({ nodes: [] });
    }
  }

  function addSelectedEdges(ids: string[]) {
    const isMultiSelection = store.multiselectionKeyPressed;

    store.edges = store.edges.map((edge) => {
      const edgeWillBeSelected = ids.includes(edge.id);
      const selected = isMultiSelection ? edge.selected || edgeWillBeSelected : edgeWillBeSelected;

      if (!!edge.selected !== selected) {
        return { ...edge, selected };
      }
      return edge;
    });

    if (!isMultiSelection) {
      unselectNodesAndEdges({ edges: [] });
    }
  }

  function handleNodeSelection(id: string, unselect?: boolean, nodeRef?: HTMLDivElement | null) {
    const node = store.nodeLookup.get(id);

    if (!node) {
      console.warn('012', errorMessages['error012'](id));
      return;
    }

    store.selectionRect = null;
    store.selectionRectMode = null;

    if (!node.selected) {
      addSelectedNodes([id]);
    } else if (unselect || (node.selected && store.multiselectionKeyPressed)) {
      unselectNodesAndEdges({ nodes: [node], edges: [] });

      requestAnimationFrame(() => nodeRef?.blur());
    }
  }

  function handleEdgeSelection(id: string) {
    const edge = store.edgeLookup.get(id);

    if (!edge) {
      console.warn('012', errorMessages['error012'](id));
      return;
    }

    const selectable =
      edge.selectable || (store.elementsSelectable && typeof edge.selectable === 'undefined');

    if (selectable) {
      store.selectionRect = null;
      store.selectionRectMode = null;

      if (!edge.selected) {
        addSelectedEdges([id]);
      } else if (edge.selected && store.multiselectionKeyPressed) {
        unselectNodesAndEdges({ nodes: [], edges: [edge] });
      }
    }
  }

  function moveSelectedNodes(direction: XYPosition, factor: number) {
    const { nodeExtent, snapGrid, nodeOrigin, nodeLookup, nodesDraggable, onerror } = store;

    const nodeUpdates = new Map();
    /*
     * by default a node moves 5px on each key press
     * if snap grid is enabled, we use that for the velocity
     */
    const xVelo = snapGrid?.[0] ?? 5;
    const yVelo = snapGrid?.[1] ?? 5;

    const xDiff = direction.x * xVelo * factor;
    const yDiff = direction.y * yVelo * factor;

    for (const node of nodeLookup.values()) {
      const isSelected =
        node.selected &&
        (node.draggable || (nodesDraggable && typeof node.draggable === 'undefined'));

      if (!isSelected) {
        continue;
      }

      let nextPosition = {
        x: node.internals.positionAbsolute.x + xDiff,
        y: node.internals.positionAbsolute.y + yDiff
      };

      if (snapGrid) {
        nextPosition = snapPosition(nextPosition, snapGrid);
      }

      const { position, positionAbsolute } = calculateNodePosition({
        nodeId: node.id,
        nextPosition,
        nodeLookup,
        nodeExtent,
        nodeOrigin,
        onError: onerror
      });

      node.position = position;
      node.internals.positionAbsolute = positionAbsolute;

      nodeUpdates.set(node.id, node);
    }
    updateNodePositions(nodeUpdates);
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

  const updateConnection: UpdateConnection = (newConnection: ConnectionState) => {
    store._connection = { ...newConnection };
  };

  function cancelConnection() {
    store._connection = initialConnection;
  }

  function reset() {
    store.resetStoreValues();
    unselectNodesAndEdges();
  }

  const storeWithActions = Object.assign(store, {
    setNodeTypes,
    setEdgeTypes,
    addEdge,
    updateNodePositions,
    updateNodeInternals,
    zoomIn,
    zoomOut,
    fitView,
    setCenter,
    setMinZoom,
    setMaxZoom,
    setTranslateExtent,
    unselectNodesAndEdges,
    addSelectedNodes,
    addSelectedEdges,
    handleNodeSelection,
    handleEdgeSelection,
    moveSelectedNodes,
    panBy,
    updateConnection,
    cancelConnection,
    reset
  } satisfies SvelteFlowStoreActions<NodeType, EdgeType>);

  return storeWithActions;
}
