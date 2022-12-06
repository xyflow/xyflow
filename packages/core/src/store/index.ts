import { createStore } from 'zustand';

import { clampPosition, getDimensions, internalsSymbol } from '../utils';
import { applyNodeChanges, createSelectionChange, getSelectionChanges } from '../utils/changes';
import { getHandleBounds } from '../components/Nodes/utils';
import { createNodeInternals, fitView, updateNodesAndEdgesSelections } from './utils';
import initialState from './initialState';
import type {
  ReactFlowState,
  Node,
  Edge,
  NodeDimensionUpdate,
  CoordinateExtent,
  NodeDimensionChange,
  EdgeSelectionChange,
  NodeSelectionChange,
  NodePositionChange,
  NodeDragItem,
  UnselectNodesAndEdgesParams,
  NodeChange,
} from '../types';

const createRFStore = () =>
  createStore<ReactFlowState>((set, get) => ({
    ...initialState,
    setNodes: (nodes: Node[]) => {
      const { nodeInternals, nodeOrigin } = get();
      set({ nodeInternals: createNodeInternals(nodes, nodeInternals, nodeOrigin) });
    },
    setEdges: (edges: Edge[]) => {
      const { defaultEdgeOptions = {} } = get();
      set({ edges: edges.map((e) => ({ ...defaultEdgeOptions, ...e })) });
    },
    setDefaultNodesAndEdges: (nodes?: Node[], edges?: Edge[]) => {
      const hasDefaultNodes = typeof nodes !== 'undefined';
      const hasDefaultEdges = typeof edges !== 'undefined';

      const nodeInternals = hasDefaultNodes ? createNodeInternals(nodes, new Map(), get().nodeOrigin) : new Map();
      const nextEdges = hasDefaultEdges ? edges : [];

      set({ nodeInternals, edges: nextEdges, hasDefaultNodes, hasDefaultEdges });
    },
    updateNodeDimensions: (updates: NodeDimensionUpdate[]) => {
      const {
        onNodesChange,
        nodeInternals,
        fitViewOnInit,
        fitViewOnInitDone,
        fitViewOnInitOptions,
        domNode,
        nodeOrigin,
      } = get();
      const viewportNode = domNode?.querySelector('.react-flow__viewport');

      if (!viewportNode) {
        return;
      }

      const style = window.getComputedStyle(viewportNode);
      const { m22: zoom } = new window.DOMMatrixReadOnly(style.transform);

      const changes: NodeDimensionChange[] = updates.reduce<NodeDimensionChange[]>((res, update) => {
        const node = nodeInternals.get(update.id);

        if (node) {
          const dimensions = getDimensions(update.nodeElement);
          const doUpdate = !!(
            dimensions.width &&
            dimensions.height &&
            (node.width !== dimensions.width || node.height !== dimensions.height || update.forceUpdate)
          );

          if (doUpdate) {
            nodeInternals.set(node.id, {
              ...node,
              [internalsSymbol]: {
                ...node[internalsSymbol],
                handleBounds: {
                  source: getHandleBounds('.source', update.nodeElement, zoom, nodeOrigin),
                  target: getHandleBounds('.target', update.nodeElement, zoom, nodeOrigin),
                },
              },
              ...dimensions,
            });

            res.push({
              id: node.id,
              type: 'dimensions',
              dimensions,
            });
          }
        }

        return res;
      }, []);

      const nextFitViewOnInitDone =
        fitViewOnInitDone ||
        (fitViewOnInit && !fitViewOnInitDone && fitView(get, { initial: true, ...fitViewOnInitOptions }));
      set({ nodeInternals: new Map(nodeInternals), fitViewOnInitDone: nextFitViewOnInitDone });

      if (changes?.length > 0) {
        onNodesChange?.(changes);
      }
    },
    updateNodePositions: (nodeDragItems: NodeDragItem[] | Node[], positionChanged = true, dragging = false) => {
      const { triggerNodeChanges } = get();

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

      triggerNodeChanges(changes);
    },

    triggerNodeChanges: (changes: NodeChange[]) => {
      const { onNodesChange, nodeInternals, hasDefaultNodes, nodeOrigin } = get();

      if (changes?.length) {
        if (hasDefaultNodes) {
          const nodes = applyNodeChanges(changes, Array.from(nodeInternals.values()));
          const nextNodeInternals = createNodeInternals(nodes, nodeInternals, nodeOrigin);
          set({ nodeInternals: nextNodeInternals });
        }

        onNodesChange?.(changes);
      }
    },

    addSelectedNodes: (selectedNodeIds: string[]) => {
      const { multiSelectionActive, nodeInternals, edges } = get();
      let changedNodes: NodeSelectionChange[];
      let changedEdges: EdgeSelectionChange[] | null = null;

      if (multiSelectionActive) {
        changedNodes = selectedNodeIds.map((nodeId) => createSelectionChange(nodeId, true)) as NodeSelectionChange[];
      } else {
        changedNodes = getSelectionChanges(Array.from(nodeInternals.values()), selectedNodeIds);
        changedEdges = getSelectionChanges(edges, []);
      }

      updateNodesAndEdgesSelections({
        changedNodes,
        changedEdges,
        get,
        set,
      });
    },
    addSelectedEdges: (selectedEdgeIds: string[]) => {
      const { multiSelectionActive, edges, nodeInternals } = get();
      let changedEdges: EdgeSelectionChange[];
      let changedNodes: NodeSelectionChange[] | null = null;

      if (multiSelectionActive) {
        changedEdges = selectedEdgeIds.map((edgeId) => createSelectionChange(edgeId, true)) as EdgeSelectionChange[];
      } else {
        changedEdges = getSelectionChanges(edges, selectedEdgeIds);
        changedNodes = getSelectionChanges(Array.from(nodeInternals.values()), []);
      }

      updateNodesAndEdgesSelections({
        changedNodes,
        changedEdges,
        get,
        set,
      });
    },
    unselectNodesAndEdges: ({ nodes, edges }: UnselectNodesAndEdgesParams = {}) => {
      const { nodeInternals, edges: storeEdges } = get();
      const nodesToUnselect = nodes ? nodes : Array.from(nodeInternals.values());
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
    setMinZoom: (minZoom: number) => {
      const { d3Zoom, maxZoom } = get();
      d3Zoom?.scaleExtent([minZoom, maxZoom]);

      set({ minZoom });
    },
    setMaxZoom: (maxZoom: number) => {
      const { d3Zoom, minZoom } = get();
      d3Zoom?.scaleExtent([minZoom, maxZoom]);

      set({ maxZoom });
    },
    setTranslateExtent: (translateExtent: CoordinateExtent) => {
      const { d3Zoom } = get();
      d3Zoom?.translateExtent(translateExtent);

      set({ translateExtent });
    },
    resetSelectedElements: () => {
      const { nodeInternals, edges } = get();
      const nodes = Array.from(nodeInternals.values());

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
    setNodeExtent: (nodeExtent: CoordinateExtent) => {
      const { nodeInternals } = get();

      nodeInternals.forEach((node) => {
        node.positionAbsolute = clampPosition(node.position, nodeExtent);
      });

      set({
        nodeExtent,
        nodeInternals: new Map(nodeInternals),
      });
    },
    cancelConnection: () =>
      set({
        connectionNodeId: initialState.connectionNodeId,
        connectionHandleId: initialState.connectionHandleId,
      }),
    reset: () => set({ ...initialState }),
  }));

export { createRFStore };
