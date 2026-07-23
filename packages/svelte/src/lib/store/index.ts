import {
  panBy as panBySystem,
  updateNodeInternals as updateNodeInternalsSystem,
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
  Position,
  type NodeChange
} from '@xyflow/system';

import type { EdgeTypes, NodeTypes, Node, Edge, FitViewOptions, InternalNode } from '$lib/types';
import { addEdge as addEdgeUtil } from '$lib/utils/edges';
import { initialEdgeTypes, initialNodeTypes, getInitialStore } from './initial-store.svelte';
import { type StoreSignals, type SvelteFlowStore, type SvelteFlowStoreActions } from './types';
import { selectionChange } from '../changes/create';
import { getSelectionChangesFor } from '../changes/utils';

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
    // TODO: trigger changes instead
    store.edges = addEdgeUtil<EdgeType>(edgeParams, store.edges, { onError: store.onerror });
  }

  const updateNodePositions: UpdateNodePositions = (nodeDragItems, dragging = false) => {
    const changes: NodeChange<NodeType>[] = [];

    for (const [id, dragItem] of nodeDragItems) {
      if (store.connection.inProgress && store.connection.fromNode.id === id) {
        const internalNode = store.nodeLookup.get(id);
        if (internalNode) {
          store.connection = {
            ...store.connection,
            from: getHandlePosition(internalNode, store.connection.fromHandle, Position.Left, true)
          };
        }
      }

      changes.push({
        id,
        type: 'position',
        position: dragItem.position,
        dragging
      });
    }

    store.dispatchNodeChanges(changes);
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

    store.dispatchNodeChanges(changes);
  }

  function fitView(options?: FitViewOptions<NodeType>) {
    // We either create a new Promise or reuse the existing one
    // Even if fitView is called multiple times in a row, we only end up with a single Promise
    const fitViewResolver = store.fitViewResolver ?? Promise.withResolvers<boolean>();

    // We schedule a fitView by setting fitViewQueued and triggering a setNodes
    store.fitViewQueued = true;
    store.fitViewOptions = options;
    store.fitViewResolver = fitViewResolver;

    // We need to update the nodes so that adoptUserNodes is triggered
    // When only render visible is enabled
    store.nodes = [...store.nodes];

    return fitViewResolver.promise;
  }

  async function setCenter(x: number, y: number, options?: SetCenterOptions) {
    const nextZoom = typeof options?.zoom !== 'undefined' ? options.zoom : store.maxZoom;
    const currentPanZoom = store.panZoom;

    if (!currentPanZoom) {
      return false;
    }

    await currentPanZoom.setViewport(
      {
        x: store.width / 2 - x * nextZoom,
        y: store.height / 2 - y * nextZoom,
        zoom: nextZoom
      },
      { duration: options?.duration, ease: options?.ease, interpolate: options?.interpolate }
    );

    return true;
  }

  async function zoomBy(factor: number, options?: ViewportHelperFunctionOptions) {
    const panZoom = store.panZoom;
    if (!panZoom) {
      return false;
    }

    return panZoom.scaleBy(factor, options);
  }

  async function zoomIn(options?: ViewportHelperFunctionOptions) {
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

  function unselectNodesAndEdges(params?: { nodes?: NodeType[]; edges?: EdgeType[] }) {
    // TODO: this is very weird
    const nodesToDeselect = params?.nodes ? new Set(params.nodes.map((node) => node.id)) : null;
    const [nodesDeselected, newNodes] = deselect(store.nodes, nodesToDeselect);
    console.log(nodesDeselected);
    if (nodesDeselected) {
      store.dispatchNodeChanges(
        newNodes
          .filter((node) => !!node.selected !== !!store.nodeLookup.get(node.id)?.selected)
          .map((node) => selectionChange(node.id, !!node.selected))
      );
    }

    const edgesToDeselect = params?.edges ? new Set(params.edges.map((node) => node.id)) : null;
    const [edgesDeselected, newEdges] = deselect(store.edges, edgesToDeselect);
    if (edgesDeselected) {
      // TODO: trigger changes instead
      store.edges = newEdges;
    }
  }

  function addSelectedNodes(ids: string[]) {
    const isMultiSelection = store.multiselectionKeyPressed;

    const changes = isMultiSelection
      ? ids.map((id) => selectionChange(id, true))
      : getSelectionChangesFor(store.nodes, new Set(ids));

    store.dispatchNodeChanges(changes);
  }

  function addSelectedEdges(ids: string[]) {
    const isMultiSelection = store.multiselectionKeyPressed;

    // TODO: trigger changes instead
    store.edges = store.edges.map((edge) => {
      const edgeWillBeSelected = ids.includes(edge.id);
      const selected = isMultiSelection ? edge.selected || edgeWillBeSelected : edgeWillBeSelected;

      if (!!edge.selected !== selected) {
        return { ...edge, selected };
      }
      return edge;
    });
  }

  function handleNodeSelection(id: string, unselect?: boolean, nodeRef?: HTMLDivElement | null) {
    console.log('handleNodeSelection', id, unselect, nodeRef);
    const node = store.nodeLookup.get(id);

    if (!node) {
      store.onerror('012', errorMessages['error012'](id));
      return;
    }

    store.selectionRect = null;
    store.selectionRectMode = null;

    if (!node.selected) {
      addSelectedNodes([id]);
    } else if (unselect || (node.selected && store.multiselectionKeyPressed)) {
      unselectNodesAndEdges({ nodes: [node.internals.userNode], edges: [] });

      requestAnimationFrame(() => nodeRef?.blur());
    }
  }

  function handleEdgeSelection(id: string) {
    const edge = store.edgeLookup.get(id);

    if (!edge) {
      store.onerror('016', errorMessages['error016'](id));
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

  const updateConnection: UpdateConnection<InternalNode<NodeType>> = (
    newConnection: ConnectionState<InternalNode<NodeType>>
  ) => {
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
