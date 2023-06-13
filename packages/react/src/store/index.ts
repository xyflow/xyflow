import { createStore } from 'zustand';
import {
  clampPosition,
  getDimensions,
  fitView,
  getHandleBounds,
  internalsSymbol,
  updateNodes,
  updateAbsolutePositions,
  type CoordinateExtent,
} from '@xyflow/system';

import { applyNodeChanges, createSelectionChange, getSelectionChanges } from '../utils/changes';
import { updateNodesAndEdgesSelections } from './utils';
import initialState from './initialState';
import type {
  ReactFlowState,
  Node,
  Edge,
  NodeDimensionChange,
  EdgeSelectionChange,
  NodeSelectionChange,
  NodePositionChange,
  UnselectNodesAndEdgesParams,
} from '../types';

const createRFStore = () =>
  createStore<ReactFlowState>((set, get) => ({
    ...initialState,
    setNodes: (nodes: Node[]) => {
      const { nodes: storeNodes, nodeOrigin, elevateNodesOnSelect } = get();
      const nextNodes = updateNodes(nodes, storeNodes, { nodeOrigin, elevateNodesOnSelect });

      set({ nodes: nextNodes });
    },
    getNodes: () => {
      return get().nodes;
    },
    setEdges: (edges: Edge[]) => {
      const { defaultEdgeOptions = {} } = get();
      set({ edges: edges.map((e) => ({ ...defaultEdgeOptions, ...e })) });
    },
    setDefaultNodesAndEdges: (nodes?: Node[], edges?: Edge[]) => {
      const hasDefaultNodes = typeof nodes !== 'undefined';
      const hasDefaultEdges = typeof edges !== 'undefined';

      const nextNodes = hasDefaultNodes
        ? updateNodes(nodes, [], {
            nodeOrigin: get().nodeOrigin,
            elevateNodesOnSelect: get().elevateNodesOnSelect,
          })
        : [];
      const nextEdges = hasDefaultEdges ? edges : [];

      set({ nodes: nextNodes, edges: nextEdges, hasDefaultNodes, hasDefaultEdges });
    },
    updateNodeDimensions: (updates) => {
      const {
        onNodesChange,
        nodes,
        fitViewOnInit,
        fitViewOnInitDone,
        fitViewOnInitOptions,
        domNode,
        nodeOrigin,
        width,
        height,
        minZoom,
        maxZoom,
        panZoom,
      } = get();
      const viewportNode = domNode?.querySelector('.react-flow__viewport');

      if (!viewportNode) {
        return;
      }

      const style = window.getComputedStyle(viewportNode);
      const { m22: zoom } = new window.DOMMatrixReadOnly(style.transform);
      const changes: NodeDimensionChange[] = [];

      const nextNodes = nodes.map((node) => {
        const update = updates.find((change) => change.id === node.id);

        if (update) {
          const dimensions = getDimensions(update.nodeElement);
          const doUpdate = !!(
            dimensions.width &&
            dimensions.height &&
            (node.width !== dimensions.width || node.height !== dimensions.height || update.forceUpdate)
          );

          if (doUpdate) {
            changes.push({
              id: node.id,
              type: 'dimensions',
              dimensions,
            });

            return {
              ...node,
              ...dimensions,
              [internalsSymbol]: {
                ...node[internalsSymbol],
                handleBounds: {
                  source: getHandleBounds('.source', update.nodeElement, zoom, node.origin || nodeOrigin),
                  target: getHandleBounds('.target', update.nodeElement, zoom, node.origin || nodeOrigin),
                },
              },
            };
          }
        }

        return node;
      });

      const nodesWithPosition = updateAbsolutePositions(nextNodes, nodeOrigin);

      const nextFitViewOnInitDone =
        fitViewOnInitDone ||
        (fitViewOnInit &&
          !!panZoom &&
          fitView(
            {
              nodes: nodesWithPosition,
              width,
              height,
              panZoom,
              minZoom,
              maxZoom,
              nodeOrigin,
            },
            fitViewOnInitOptions
          ));
      set({ nodes: nodesWithPosition, fitViewOnInitDone: nextFitViewOnInitDone });

      if (changes?.length > 0) {
        onNodesChange?.(changes);
      }
    },
    updateNodePositions: (nodeDragItems, positionChanged = true, dragging = false) => {
      const changes = nodeDragItems.map((node) => {
        const change: NodePositionChange = {
          id: node.id,
          type: 'position',
          dragging,
        };

        if (positionChanged) {
          change.positionAbsolute = node.positionAbsolute;
          change.position = node.position;
        }

        return change;
      });

      get().triggerNodeChanges(changes);
    },

    triggerNodeChanges: (changes) => {
      const { onNodesChange, nodes, hasDefaultNodes, nodeOrigin, elevateNodesOnSelect } = get();

      if (changes?.length) {
        if (hasDefaultNodes) {
          const updatedNodes = applyNodeChanges(changes, nodes);
          const nextNodes = updateNodes(updatedNodes, nodes, {
            nodeOrigin,
            elevateNodesOnSelect,
          });
          set({ nodes: nextNodes });
        }

        onNodesChange?.(changes);
      }
    },

    addSelectedNodes: (selectedNodeIds) => {
      const { multiSelectionActive, edges, nodes } = get();
      let changedNodes: NodeSelectionChange[];
      let changedEdges: EdgeSelectionChange[] | null = null;

      if (multiSelectionActive) {
        changedNodes = selectedNodeIds.map((nodeId) => createSelectionChange(nodeId, true)) as NodeSelectionChange[];
      } else {
        changedNodes = getSelectionChanges(nodes, selectedNodeIds);
        changedEdges = getSelectionChanges(edges, []);
      }

      updateNodesAndEdgesSelections({
        changedNodes,
        changedEdges,
        get,
        set,
      });
    },
    addSelectedEdges: (selectedEdgeIds) => {
      const { multiSelectionActive, edges, nodes } = get();
      let changedEdges: EdgeSelectionChange[];
      let changedNodes: NodeSelectionChange[] | null = null;

      if (multiSelectionActive) {
        changedEdges = selectedEdgeIds.map((edgeId) => createSelectionChange(edgeId, true)) as EdgeSelectionChange[];
      } else {
        changedEdges = getSelectionChanges(edges, selectedEdgeIds);
        changedNodes = getSelectionChanges(nodes, []);
      }

      updateNodesAndEdgesSelections({
        changedNodes,
        changedEdges,
        get,
        set,
      });
    },
    unselectNodesAndEdges: ({ nodes, edges }: UnselectNodesAndEdgesParams = {}) => {
      const { edges: storeEdges, nodes: storeNodes } = get();
      const nodesToUnselect = nodes ? nodes : storeNodes;
      const edgesToUnselect = edges ? edges : storeEdges;

      const changedNodes = nodesToUnselect.map((n) => {
        n.selected = false;
        return createSelectionChange(n.id, false);
      }) as NodeSelectionChange[];
      const changedEdges = edgesToUnselect.map((edge) =>
        createSelectionChange(edge.id, false)
      ) as EdgeSelectionChange[];

      updateNodesAndEdgesSelections({
        changedNodes,
        changedEdges,
        get,
        set,
      });
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
      const { edges, nodes } = get();

      const nodesToUnselect = nodes
        .filter((e) => e.selected)
        .map((n) => createSelectionChange(n.id, false)) as NodeSelectionChange[];
      const edgesToUnselect = edges
        .filter((e) => e.selected)
        .map((e) => createSelectionChange(e.id, false)) as EdgeSelectionChange[];

      updateNodesAndEdgesSelections({
        changedNodes: nodesToUnselect,
        changedEdges: edgesToUnselect,
        get,
        set,
      });
    },
    setNodeExtent: (nodeExtent) => {
      const { nodes } = get();

      set({
        nodeExtent,
        nodes: nodes.map((node) => {
          const positionAbsolute = clampPosition(node.position, nodeExtent);

          return {
            ...node,
            positionAbsolute,
          };
        }),
      });
    },
    panBy: (delta): boolean => {
      const { transform, width, height, panZoom, translateExtent } = get();

      if (!panZoom || (!delta.x && !delta.y)) {
        return false;
      }

      const extent: CoordinateExtent = [
        [0, 0],
        [width, height],
      ];

      const constrainedTransform = panZoom.setViewportConstrained(
        { x: transform[0] + delta.x, y: transform[1] + delta.y, zoom: transform[2] },
        extent,
        translateExtent
      );

      const transformChanged =
        !!constrainedTransform &&
        (transform[0] !== constrainedTransform.x ||
          transform[1] !== constrainedTransform.y ||
          transform[2] !== constrainedTransform.k);

      return transformChanged;
    },
    cancelConnection: () =>
      set({
        connectionStatus: initialState.connectionStatus,
        connectionStartHandle: initialState.connectionStartHandle,
        connectionEndHandle: initialState.connectionEndHandle,
      }),
    updateConnection: (params) => {
      const { connectionStatus, connectionStartHandle, connectionEndHandle, connectionPosition } = get();

      const currentConnection = {
        connectionPosition: params.connectionPosition ?? connectionPosition,
        connectionStatus: params.connectionStatus ?? connectionStatus,
        connectionStartHandle: params.connectionStartHandle ?? connectionStartHandle,
        connectionEndHandle: params.connectionEndHandle ?? connectionEndHandle,
      };

      set(currentConnection);
    },
    reset: () => set({ ...initialState }),
  }));

export { createRFStore };
