import { createStore as createZustandStore } from 'zustand/vanilla';
import {
  adoptUserNodes,
  panBy as panBySystem,
  updateNodeInternals as updateNodeInternalsSystem,
  updateConnectionLookup,
  handleExpandParent,
  NodeChange,
  ParentExpandChild,
  initialConnection,
  fitViewport,
  getHandlePosition,
  Position,
  selectionChange,
  getSelectionChanges,
  SelectionChange,
  NodeChangeset,
  EdgeChangeset,
} from '@xyflow/system';

import getInitialState from './initialState';
import type {
  ReactFlowState,
  ViewportStore,
  ConnectionStore,
  NodesStore,
  EdgesStore,
  SelectionStore,
  Node,
  Edge,
  UnselectNodesAndEdgesParams,
} from '../types';

const createStore = (options: Parameters<typeof getInitialState>[0]) => {
  const initialState = getInitialState(options);
  const viewportStore = createZustandStore<ViewportStore>(() => initialState.viewportStore);
  const connectionStore = createZustandStore<ConnectionStore>(() => initialState.connectionStore);
  const nodesStore = createZustandStore<NodesStore>(() => initialState.nodesStore);
  const edgesStore = createZustandStore<EdgesStore>(() => initialState.edgesStore);
  const selectionStore = createZustandStore<SelectionStore>(() => initialState.selectionStore);

  const optionsStore = createZustandStore<ReactFlowState>((set, get) => {
    async function resolveFitView() {
      const { nodeLookup } = nodesStore.getState();
      const { panZoom, fitViewOptions, fitViewResolver, minZoom, maxZoom } = get();
      const { width, height } = viewportStore.getState();

      if (!panZoom) {
        return;
      }

      await fitViewport(
        {
          nodes: nodeLookup,
          width,
          height,
          panZoom,
          minZoom,
          maxZoom,
        },
        fitViewOptions
      );

      fitViewResolver?.resolve(true);
      /**
       * wait for the fitViewport to resolve before deleting the resolver,
       * we want to reuse the old resolver if the user calls fitView again in the mean time
       */
      set({ fitViewResolver: null });
    }

    return {
      ...initialState.optionsStore,
      setNodes: (nodes: Node[]) => {
        const { nodeLookup, parentLookup } = nodesStore.getState();
        const {
          nodeOrigin,
          nodeExtent,
          elevateNodesOnSelect,
          fitViewQueued,
          zIndexMode,
          nodesSelectionActive,
          pubSub,
        } = get();

        /*
         * setNodes() is called exclusively in response to user actions:
         * - either when the `<ReactFlow nodes>` prop is updated in the controlled ReactFlow setup,
         * - or when the user calls something like `reactFlowInstance.setNodes()` in an uncontrolled ReactFlow setup.
         *
         * When this happens, we take the note objects passed by the user and extend them with fields
         * relevant for internal React Flow operations.
         */

        const { nodesInitialized, hasSelectedNodes, updatedNodes } = adoptUserNodes(nodes, nodeLookup, parentLookup, {
          nodeOrigin,
          nodeExtent,
          elevateNodesOnSelect,
          checkEquality: true,
          zIndexMode,
        });

        const nextNodesSelectionActive = nodesSelectionActive && hasSelectedNodes;

        if (fitViewQueued && nodesInitialized) {
          void resolveFitView();
          set({ fitViewQueued: false, fitViewOptions: undefined, nodesSelectionActive: nextNodesSelectionActive });
        } else if (nodesSelectionActive !== nextNodesSelectionActive) {
          set({ nodesSelectionActive: nextNodesSelectionActive });
        }

        nodesStore.setState({ nodes, nodesInitialized });
        pubSub.publishNodes(updatedNodes);
      },
      setEdges: (edges: Edge[]) => {
        const { connectionLookup, edgeLookup } = edgesStore.getState();

        const { updatedEdges } = updateConnectionLookup(connectionLookup, edgeLookup, edges);

        edgesStore.setState({ edges });
        get().pubSub.publishEdges(updatedEdges);
      },
      setDefaultNodesAndEdges: (nodes?: Node[], edges?: Edge[]) => {
        if (nodes) {
          const { setNodes } = get();
          setNodes(nodes);
          set({ hasDefaultNodes: true });
        }
        if (edges) {
          const { setEdges } = get();
          setEdges(edges);
          set({ hasDefaultEdges: true });
        }
      },
      /*
       * Every node gets registered at a ResizeObserver. Whenever a node
       * changes its dimensions, this function is called to measure the
       * new dimensions and update the nodes.
       */
      updateNodeInternals: (updates) => {
        const { emitNodeChanges, domNode, nodeOrigin, nodeExtent, fitViewQueued, zIndexMode, pubSub } = get();
        const { nodeLookup, parentLookup } = nodesStore.getState();

        const { changes, updatedInternals, updatedNodes } = updateNodeInternalsSystem(
          updates,
          nodeLookup,
          parentLookup,
          domNode,
          nodeOrigin,
          nodeExtent,
          zIndexMode
        );

        if (!updatedInternals) {
          return;
        }

        if (fitViewQueued) {
          void resolveFitView();
          set({ fitViewQueued: false, fitViewOptions: undefined });
        }

        // Internal measurements can change without changing the public nodes array.
        nodesStore.setState({});
        pubSub.publishNodes(updatedNodes);
        emitNodeChanges(changes);
      },
      updateNodePositions: (nodeDragItems, dragging = false) => {
        const parentExpandChildren: ParentExpandChild[] = [];
        let changes = [];
        const { nodeLookup } = nodesStore.getState();
        const { emitNodeChanges, updateConnection, onNodesChangeMiddlewareMap } = get();
        const { connection } = connectionStore.getState();

        for (const [id, dragItem] of nodeDragItems) {
          // we are using the nodelookup to be sure to use the current expandParent and parentId value
          const node = nodeLookup.get(id);
          const expandParent = !!(node?.expandParent && node?.parentId && dragItem?.position);

          const change: NodeChange = {
            id,
            type: 'position',
            position: expandParent
              ? {
                  x: Math.max(0, dragItem.position.x),
                  y: Math.max(0, dragItem.position.y),
                }
              : dragItem.position,
            dragging,
          };

          if (node && connection.inProgress && connection.fromNode.id === node.id) {
            const updatedFrom = getHandlePosition(node, connection.fromHandle, Position.Left, true);
            updateConnection({ ...connection, from: updatedFrom });
          }

          if (expandParent && node.parentId) {
            parentExpandChildren.push({
              id,
              parentId: node.parentId,
              rect: {
                ...dragItem.internals.positionAbsolute,
                width: dragItem.measured.width ?? 0,
                height: dragItem.measured.height ?? 0,
              },
            });
          }

          changes.push(change);
        }

        if (parentExpandChildren.length > 0) {
          const { parentLookup } = nodesStore.getState();
          const { nodeOrigin } = get();
          const parentExpandChanges = handleExpandParent(parentExpandChildren, nodeLookup, parentLookup, nodeOrigin);
          changes.push(...parentExpandChanges);
        }

        for (const middleware of onNodesChangeMiddlewareMap.values()) {
          changes = middleware(changes);
        }

        emitNodeChanges(changes);
      },
      emitNodeChanges: (changes) => {
        if (changes.length === 0) {
          return;
        }

        const { debug, onNodesChange, hasDefaultNodes } = get();
        const nodeChanges = new NodeChangeset(changes);

        if (debug) {
          console.log('React Flow: queue node changes', changes);
        }

        if (hasDefaultNodes) {
          const { nodes } = nodesStore.getState();
          const { setNodes } = get();
          const newNodes = nodeChanges.applyTo(nodes);
          setNodes(newNodes);
        }

        onNodesChange?.(nodeChanges);
      },
      emitEdgeChanges: (changes) => {
        if (changes.length === 0) {
          return;
        }

        const { debug, hasDefaultEdges, onEdgesChange } = get();
        const edgeChanges = new EdgeChangeset(changes);

        if (debug) {
          console.log('React Flow: queue edge changes', changes);
        }

        if (hasDefaultEdges) {
          const { setEdges } = get();
          const { edges } = edgesStore.getState();
          const newEdges = edgeChanges.applyTo(edges);
          setEdges(newEdges);
        }

        onEdgesChange?.(edgeChanges);
      },

      addSelectedNodes: (selectedNodeIds) => {
        const { multiSelectionActive, emitNodeChanges, emitEdgeChanges } = get();
        const { edgeLookup } = edgesStore.getState();
        const { nodeLookup } = nodesStore.getState();

        if (multiSelectionActive) {
          const nodeChanges = selectedNodeIds.map((nodeId) => selectionChange(nodeId, true));
          emitNodeChanges(nodeChanges);
          return;
        }

        emitNodeChanges(getSelectionChanges(nodeLookup, new Set([...selectedNodeIds]), true));
        emitEdgeChanges(getSelectionChanges(edgeLookup));
      },
      addSelectedEdges: (selectedEdgeIds) => {
        const { multiSelectionActive, emitNodeChanges, emitEdgeChanges } = get();
        const { edgeLookup } = edgesStore.getState();
        const { nodeLookup } = nodesStore.getState();

        if (multiSelectionActive) {
          const changedEdges = selectedEdgeIds.map((edgeId) => selectionChange(edgeId, true));
          emitEdgeChanges(changedEdges);
          return;
        }

        emitEdgeChanges(getSelectionChanges(edgeLookup, new Set([...selectedEdgeIds])));
        emitNodeChanges(getSelectionChanges(nodeLookup, new Set(), true));
      },
      unselectNodesAndEdges: ({ nodes, edges }: UnselectNodesAndEdgesParams = {}) => {
        const { edges: storeEdges } = edgesStore.getState();
        const { nodes: storeNodes, nodeLookup } = nodesStore.getState();
        const { emitNodeChanges, emitEdgeChanges } = get();
        const nodesToUnselect = nodes ? nodes : storeNodes;
        const edgesToUnselect = edges ? edges : storeEdges;

        const nodeChanges: SelectionChange[] = [];

        for (const node of nodesToUnselect) {
          if (!node.selected) {
            continue; // skip changing nodes that are not selected
          }

          const internalNode = nodeLookup.get(node.id);

          if (internalNode) {
            /*
             * we need to unselect the internal node that was selected previously before we
             * send the change to the user to prevent it to be selected while dragging the new node
             */
            internalNode.selected = false;
          }

          nodeChanges.push(selectionChange(node.id, false));
        }

        const edgeChanges: SelectionChange[] = [];

        for (const edge of edgesToUnselect) {
          if (!edge.selected) {
            continue; // skip changing edges that are not selected
          }

          edgeChanges.push(selectionChange(edge.id, false));
        }

        emitNodeChanges(nodeChanges);
        emitEdgeChanges(edgeChanges);
      },
      setMinZoom: (minZoom) => {
        const { panZoom, maxZoom } = get();
        panZoom?.setScaleExtent([minZoom, maxZoom]);

        set({ minZoom });
      },
      setMaxZoom: (maxZoom) => {
        const { panZoom, minZoom } = get();
        panZoom?.setScaleExtent([minZoom, maxZoom]);

        set({ maxZoom });
      },
      setTranslateExtent: (translateExtent) => {
        get().panZoom?.setTranslateExtent(translateExtent);

        set({ translateExtent });
      },
      resetSelectedElements: () => {
        const { edges } = edgesStore.getState();
        const { nodes } = nodesStore.getState();
        const { emitNodeChanges, emitEdgeChanges, elementsSelectable } = get();

        if (!elementsSelectable) {
          return;
        }

        const nodeChanges = nodes.reduce<SelectionChange[]>(
          (res, node) => (node.selected ? [...res, selectionChange(node.id, false)] : res),
          []
        );
        const edgeChanges = edges.reduce<SelectionChange[]>(
          (res, edge) => (edge.selected ? [...res, selectionChange(edge.id, false)] : res),
          []
        );

        emitNodeChanges(nodeChanges);
        emitEdgeChanges(edgeChanges);
      },
      setNodeExtent: (nextNodeExtent) => {
        const { nodes, nodeLookup, parentLookup } = nodesStore.getState();
        const { nodeOrigin, elevateNodesOnSelect, nodeExtent, zIndexMode, pubSub } = get();

        if (
          nextNodeExtent[0][0] === nodeExtent[0][0] &&
          nextNodeExtent[0][1] === nodeExtent[0][1] &&
          nextNodeExtent[1][0] === nodeExtent[1][0] &&
          nextNodeExtent[1][1] === nodeExtent[1][1]
        ) {
          return;
        }

        const { updatedNodes } = adoptUserNodes(nodes, nodeLookup, parentLookup, {
          nodeOrigin,
          nodeExtent: nextNodeExtent,
          elevateNodesOnSelect,
          checkEquality: false,
          zIndexMode,
        });

        set({ nodeExtent: nextNodeExtent });
        nodesStore.setState({});
        pubSub.publishNodes(updatedNodes);
      },
      panBy: (delta): Promise<boolean> => {
        const { transform, width, height } = viewportStore.getState();
        const { panZoom, translateExtent } = get();

        return panBySystem({ delta, panZoom, transform, translateExtent, width, height });
      },
      setCenter: async (x, y, options) => {
        const { width, height } = viewportStore.getState();
        const { maxZoom, panZoom } = get();

        if (!panZoom) {
          return false;
        }

        const nextZoom = typeof options?.zoom !== 'undefined' ? options.zoom : maxZoom;

        await panZoom.setViewport(
          {
            x: width / 2 - x * nextZoom,
            y: height / 2 - y * nextZoom,
            zoom: nextZoom,
          },
          { duration: options?.duration, ease: options?.ease, interpolate: options?.interpolate }
        );

        return true;
      },
      cancelConnection: () => {
        const { connection: previousConnection } = connectionStore.getState();
        connectionStore.setState({ connection: initialConnection });
        get().pubSub.publishConnection(previousConnection, initialConnection);
      },
      updateConnection: (connection) => {
        const { connection: previousConnection } = connectionStore.getState();
        connectionStore.setState({ connection });
        get().pubSub.publishConnection(previousConnection, connection);
      },
      updateConnectionClickStart: (connectionClickStartHandle) => {
        connectionStore.setState({ connectionClickStartHandle });
        get().pubSub.publishConnectionClickStart();
      },

      reset: () => {
        const initialState = getInitialState();
        viewportStore.setState(initialState.viewportStore);
        connectionStore.setState(initialState.connectionStore);
        nodesStore.setState(initialState.nodesStore);
        edgesStore.setState(initialState.edgesStore);
        selectionStore.setState(initialState.selectionStore);

        const { pubSub } = get();
        // Keep mounted hooks subscribed to the same PubSub instance.
        set({ ...initialState.optionsStore, pubSub });
        pubSub.reset();
      },
    };
  });

  return { optionsStore, viewportStore, connectionStore, nodesStore, edgesStore, selectionStore };
};

export { createStore };
