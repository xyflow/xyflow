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
  ReactFlowStore,
} from '../types';
import { isNode, isEdge, getRectOfNodes, getNodesInside, getConnectedEdges } from '../utils/graph';
import { getHandleBounds } from '../components/Nodes/utils';
import { createNodeInternals, createNodeOrEdgeSelectionChange } from './utils';

const { Provider, useStore, useStoreApi } = createContext<ReactFlowState>();

const infiniteExtent: CoordinateExtent = [
  [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
  [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
];

const initialState: ReactFlowStore = {
  width: 0,
  height: 0,
  transform: [0, 0, 1],
  nodeInternals: new Map(),
  edges: [],
  onNodesChange: null,
  onEdgesChange: null,
  selectedNodesBbox: { x: 0, y: 0, width: 0, height: 0 },
  d3Zoom: null,
  d3Selection: null,
  d3ZoomHandler: undefined,
  minZoom: 0.5,
  maxZoom: 2,
  translateExtent: infiniteExtent,
  nodeExtent: infiniteExtent,
  nodesSelectionActive: false,
  selectionActive: false,
  userSelectionRect: {
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    draw: false,
  },
  connectionNodeId: null,
  connectionHandleId: null,
  connectionHandleType: 'source',
  connectionPosition: { x: 0, y: 0 },
  connectionMode: ConnectionMode.Strict,

  snapGrid: [15, 15],
  snapToGrid: false,

  nodesDraggable: true,
  nodesConnectable: true,
  elementsSelectable: true,

  multiSelectionActive: false,

  reactFlowVersion: typeof __REACT_FLOW_VERSION__ !== 'undefined' ? __REACT_FLOW_VERSION__ : '-',
};

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

      const nodesToChange: NodeChange[] = updates.reduce<NodeChange[]>((res, update) => {
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

            const change = {
              id: node.id,
              type: 'dimensions',
              dimensions,
            } as NodeChange;
            res.push(change);
          }
        }

        return res;
      }, []);

      set({ nodeInternals: new Map(nodeInternals) });

      if (nodesToChange?.length > 0) {
        onNodesChange?.(nodesToChange);
      }
    },
    updateNodePosition: ({ id, diff, dragging }: NodeDiffUpdate) => {
      const { onNodesChange, nodeExtent, nodeInternals } = get();

      if (onNodesChange) {
        const nodes = Array.from(nodeInternals);
        const matchingNodes = nodes.filter(([_, n]) => !!(n.selected || n.id === id));
        if (matchingNodes?.length) {
          onNodesChange(
            matchingNodes?.map(([_, node]) => {
              const change: NodeDimensionChange = {
                id: node.id,
                type: 'dimensions',
                dragging: !!dragging,
              };

              if (diff) {
                let currentExtent = nodeExtent || node.extent;

                if (node.extent === 'parent' && node.parentNode && node.width && node.height) {
                  const parent = nodeInternals.get(node.parentNode);
                  currentExtent =
                    parent?.width && parent?.height
                      ? [
                          [0, 0],
                          [parent.width - node.width, parent.height - node.height],
                        ]
                      : currentExtent;
                }

                change.position = currentExtent
                  ? clampPosition(
                      {
                        x: node.position.x + diff.x,
                        y: node.position.y + diff.y,
                      },
                      currentExtent
                    )
                  : { x: node.position.x + diff.x, y: node.position.y + diff.y };
              }

              return change;
            })
          );
        }
      }
    },
    setUserSelection: (mousePos: XYPosition) => {
      set({
        selectionActive: true,
        userSelectionRect: {
          width: 0,
          height: 0,
          startX: mousePos.x,
          startY: mousePos.y,
          x: mousePos.x,
          y: mousePos.y,
          draw: true,
        },
      });
    },
    updateUserSelection: (mousePos: XYPosition) => {
      const { userSelectionRect, nodeInternals, edges, transform, onNodesChange, onEdgesChange } = get();
      const startX = userSelectionRect.startX ?? 0;
      const startY = userSelectionRect.startY ?? 0;

      const nextUserSelectRect = {
        ...userSelectionRect,
        x: mousePos.x < startX ? mousePos.x : userSelectionRect.x,
        y: mousePos.y < startY ? mousePos.y : userSelectionRect.y,
        width: Math.abs(mousePos.x - startX),
        height: Math.abs(mousePos.y - startY),
      };

      // @TODO: work with nodeInternals instead of converting it to an array
      const nodes = Array.from(nodeInternals).map(([_, node]) => node);
      const selectedNodes = getNodesInside(nodes, nextUserSelectRect, transform, false, true);
      const selectedEdgeIds = getConnectedEdges(selectedNodes, edges).map((e) => e.id);
      const selectedNodeIds = selectedNodes.map((n) => n.id);

      onNodesChange?.(
        nodes.map((n) => createNodeOrEdgeSelectionChange(selectedNodeIds.includes(n.id))(n)) as NodeChange[]
      );
      onEdgesChange?.(
        edges.map((e) => createNodeOrEdgeSelectionChange(selectedEdgeIds.includes(e.id))(e)) as EdgeChange[]
      );

      set({
        userSelectionRect: nextUserSelectRect,
      });
    },
    unsetUserSelection: () => {
      const { userSelectionRect, nodeInternals } = get();
      // @TODO: work with nodeInternals instead of converting it to an array
      const nodes = Array.from(nodeInternals).map(([_, node]) => node);
      const selectedNodes = nodes.filter((node) => node.selected);

      const stateUpdate = {
        selectionActive: false,
        userSelectionRect: {
          ...userSelectionRect,
          draw: false,
        },
        selectedNodesBbox: { x: 0, y: 0, width: 0, height: 0 },
        nodesSelectionActive: false,
      };

      if (selectedNodes && selectedNodes.length > 0) {
        const selectedNodesBbox = getRectOfNodes(selectedNodes);
        stateUpdate.selectedNodesBbox = selectedNodesBbox;
        stateUpdate.nodesSelectionActive = true;
      }

      set(stateUpdate);
    },
    addSelectedElements: (selectedElementsArr: Array<Node | Edge>) => {
      const { multiSelectionActive, onNodesChange, onEdgesChange, nodeInternals, edges } = get();
      // @TODO: work with nodeInternals instead of converting it to an array
      const nodes = Array.from(nodeInternals).map(([_, node]) => node);
      let changedNodes;
      let changedEdges;

      if (multiSelectionActive) {
        changedNodes = selectedElementsArr.filter(isNode).map(createNodeOrEdgeSelectionChange(true));
        changedEdges = selectedElementsArr.filter(isEdge).map(createNodeOrEdgeSelectionChange(true));
      } else {
        changedNodes = nodes.map((node) =>
          createNodeOrEdgeSelectionChange(selectedElementsArr.some((e) => e.id === node.id))(node)
        );
        changedEdges = edges.map((edge) =>
          createNodeOrEdgeSelectionChange(selectedElementsArr.some((e) => e.id === edge.id))(edge)
        );
      }

      if (changedNodes.length) {
        onNodesChange?.(changedNodes as NodeChange[]);
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
        return createNodeOrEdgeSelectionChange(false)(n);
      }) as NodeChange[];
      const edgesToUnselect = edges.map(createNodeOrEdgeSelectionChange(false)) as EdgeChange[];

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
      const nodesToUnselect = nodes.filter((e) => e.selected).map(createNodeOrEdgeSelectionChange(false));
      const edgesToUnselect = edges.filter((e) => e.selected).map(createNodeOrEdgeSelectionChange(false));

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
    unsetNodesSelection: () => set({ nodesSelectionActive: false }),
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
