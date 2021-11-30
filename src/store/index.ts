import create from 'zustand';
import createContext from 'zustand/context';

import { clampPosition, getDimensions } from '../utils';
import {
  ReactFlowState,
  ConnectionMode,
  Node,
  Edge,
  NodeDimensionUpdate,
  NodeDiffUpdate,
  InitD3ZoomPayload,
  CoordinateExtent,
  OnConnect,
  OnConnectStart,
  OnConnectStop,
  OnConnectEnd,
  SetConnectionId,
  SnapGrid,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  EdgeChange,
  NodeDimensionChange,
  Transform,
  Dimensions,
  XYPosition,
} from '../types';
import { getHandleBounds } from '../components/Nodes/utils';
import { createSelectionChange, getSelectionChanges } from '../utils/changes';
import { createNodeInternals, createPositionChange, isParentSelected } from './utils';
import initialState from './initialState';

const { Provider, useStore, useStoreApi } = createContext<ReactFlowState>();

const createStore = () =>
  create<ReactFlowState>((set, get) => ({
    ...initialState,

    setNodes: (nodes: Node[]) => {
      const nodeInternals = createNodeInternals(nodes, get().nodeInternals);

      set({ nodeInternals });
    },
    setEdges: (edges: Edge[]) => {
      set({ edges });
    },
    updateNodeDimensions: (updates: NodeDimensionUpdate[]) => {
      const { onNodesChange, transform, nodeInternals } = get();

      const changes: NodeChange[] = updates.reduce<NodeChange[]>((res, update) => {
        const node = nodeInternals.get(update.id);

        if (node) {
          const dimensions = getDimensions(update.nodeElement);
          const doUpdate = !!(
            dimensions.width &&
            dimensions.height &&
            (node.width !== dimensions.width || node.height !== dimensions.height || update.forceUpdate)
          );

          if (doUpdate) {
            const handleBounds = getHandleBounds(update.nodeElement, transform[2]);
            nodeInternals.set(node.id, {
              ...node,
              handleBounds,
              ...dimensions,
            });

            res.push({
              id: node.id,
              type: 'dimensions',
              dimensions,
            } as NodeChange);
          }
        }

        return res;
      }, []);

      set({ nodeInternals: new Map(nodeInternals) });

      if (changes?.length > 0) {
        onNodesChange?.(changes);
      }
    },
    updateNodePosition: ({ id, diff, dragging }: NodeDiffUpdate) => {
      const { onNodesChange, nodeExtent, nodeInternals } = get();

      if (onNodesChange) {
        const changes: NodeDimensionChange[] = [];

        nodeInternals.forEach((node) => {
          if (node.selected) {
            if (!node.parentNode) {
              changes.push(createPositionChange({ node, diff, dragging, nodeExtent, nodeInternals }));
            } else if (!isParentSelected(node, nodeInternals)) {
              changes.push(createPositionChange({ node, diff, dragging, nodeExtent, nodeInternals }));
            }
          } else if (node.id === id) {
            changes.push(createPositionChange({ node, diff, dragging, nodeExtent, nodeInternals }));
          }
        });

        if (changes?.length) {
          onNodesChange(changes);
        }
      }
    },
    addSelectedNodes: (selectedNodeIds: string[]) => {
      const { multiSelectionActive, onNodesChange, nodeInternals } = get();
      // @TODO: work with nodeInternals instead of converting it to an array
      const nodes = Array.from(nodeInternals).map(([_, node]) => node);
      let changedNodes;

      if (multiSelectionActive) {
        changedNodes = selectedNodeIds.map((nodeId) => createSelectionChange(nodeId, true));
      } else {
        changedNodes = getSelectionChanges(nodes, selectedNodeIds);
      }

      if (changedNodes.length) {
        onNodesChange?.(changedNodes as NodeChange[]);
      }
    },
    addSelectedEdges: (selectedEdgeIds: string[]) => {
      const { multiSelectionActive, onEdgesChange, edges } = get();

      let changedEdges;

      if (multiSelectionActive) {
        changedEdges = selectedEdgeIds.map((edgeId) => createSelectionChange(edgeId, true));
      } else {
        changedEdges = getSelectionChanges(edges, selectedEdgeIds);
      }

      if (changedEdges.length) {
        onEdgesChange?.(changedEdges as EdgeChange[]);
      }
    },
    unselectNodesAndEdges: () => {
      const { nodeInternals, edges, onNodesChange, onEdgesChange } = get();
      // @TODO: work with nodeInternals instead of converting it to an array
      const nodes = Array.from(nodeInternals).map(([_, node]) => node);

      const nodesToUnselect = nodes.map((n) => {
        n.selected = false;
        return createSelectionChange(n.id, false);
      }) as NodeChange[];
      const edgesToUnselect = edges.map((edge) => createSelectionChange(edge.id, false)) as EdgeChange[];

      if (nodesToUnselect.length) {
        onNodesChange?.(nodesToUnselect);
      }
      if (edgesToUnselect.length) {
        onEdgesChange?.(edgesToUnselect);
      }
    },
    initD3Zoom: ({ d3Zoom, d3Selection, d3ZoomHandler, transform }: InitD3ZoomPayload) =>
      set({
        d3Zoom,
        d3Selection,
        d3ZoomHandler,
        transform,
      }),
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
      const { nodeInternals, edges, onNodesChange, onEdgesChange } = get();
      // @TODO: work with nodeInternals instead of converting it to an array
      const nodes = Array.from(nodeInternals).map(([_, node]) => node);
      const nodesToUnselect = nodes.filter((e) => e.selected).map((n) => createSelectionChange(n.id, false));
      const edgesToUnselect = edges.filter((e) => e.selected).map((e) => createSelectionChange(e.id, false));

      if (nodesToUnselect.length) {
        onNodesChange?.(nodesToUnselect as NodeChange[]);
      }
      if (edgesToUnselect.length) {
        onEdgesChange?.(edgesToUnselect as EdgeChange[]);
      }
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
    setUserSelectionActive: (userSelectionActive: boolean) => set({ userSelectionActive }),
    setNodesSelectionActive: (nodesSelectionActive: boolean) => set({ nodesSelectionActive }),
    updateTransform: (transform: Transform) => set({ transform }),
    updateSize: (size: Dimensions) => set({ width: size.width || 500, height: size.height || 500 }),
    setOnConnect: (onConnect: OnConnect) => set({ onConnect }),
    setOnConnectStart: (onConnectStart: OnConnectStart) => set({ onConnectStart }),
    setOnConnectStop: (onConnectStop: OnConnectStop) => set({ onConnectStop }),
    setOnConnectEnd: (onConnectEnd: OnConnectEnd) => set({ onConnectEnd }),
    setConnectionPosition: (connectionPosition: XYPosition) => set({ connectionPosition }),
    setConnectionNodeId: (params: SetConnectionId) => set({ ...params }),
    setSnapToGrid: (snapToGrid: boolean) => set({ snapToGrid }),
    setSnapGrid: (snapGrid: SnapGrid) => set({ snapGrid }),
    setInteractive: (isInteractive: boolean) =>
      set({
        nodesDraggable: isInteractive,
        nodesConnectable: isInteractive,
        elementsSelectable: isInteractive,
      }),
    setNodesDraggable: (nodesDraggable: boolean) => set({ nodesDraggable }),
    setNodesConnectable: (nodesConnectable: boolean) => set({ nodesConnectable }),
    setElementsSelectable: (elementsSelectable: boolean) => set({ elementsSelectable }),
    setMultiSelectionActive: (multiSelectionActive: boolean) => set({ multiSelectionActive }),
    setConnectionMode: (connectionMode: ConnectionMode) => set({ connectionMode }),
    setOnNodesChange: (onNodesChange: OnNodesChange) => set({ onNodesChange }),
    setOnEdgesChange: (onEdgesChange: OnEdgesChange) => set({ onEdgesChange }),
    reset: () => set({ ...initialState }),
  }));

export { Provider, useStore, createStore, useStoreApi };
