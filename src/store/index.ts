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
  XYPosition,
  InitD3ZoomPayload,
  TranslateExtent,
  NodeExtent,
  Transform,
  Dimensions,
  OnConnectFunc,
  OnConnectStartFunc,
  OnConnectStopFunc,
  OnConnectEndFunc,
  SetConnectionId,
  SnapGrid,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  EdgeChange,
  NodePositionChange,
} from '../types';
import { isNode, isEdge, getRectOfNodes, getNodesInside, getConnectedEdges } from '../utils/graph';
import { getHandleBounds } from '../components/Nodes/utils';

const { Provider, useStore, useStoreApi } = createContext<ReactFlowState>();

const createNodeOrEdgeSelectionChange = (isSelected: boolean) => (item: Node | Edge) => ({
  id: item.id,
  type: 'select',
  isSelected,
});

const createStore = () =>
  create<ReactFlowState>((set, get) => ({
    width: 0,
    height: 0,
    transform: [0, 0, 1],
    nodes: [],
    edges: [],
    onNodesChange: null,
    onEdgesChange: null,

    selectedNodesBbox: { x: 0, y: 0, width: 0, height: 0 },

    d3Zoom: null,
    d3Selection: null,
    d3ZoomHandler: undefined,
    minZoom: 0.5,
    maxZoom: 2,
    translateExtent: [
      [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
      [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
    ],

    nodeExtent: [
      [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
      [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
    ],

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

    setNodes: (propNodes: Node[]) => {
      const { nodes } = get();
      const nextNodes = propNodes.map((propNode: Node) => {
        const storeNode = nodes.find((node) => node.id === propNode.id);

        if (storeNode) {
          if (typeof propNode.type !== 'undefined' && propNode.type !== storeNode.type) {
            // we reset the elements dimensions here in order to force a re-calculation of the bounds.
            // When the type of a node changes it is possible that the number or positions of handles changes too.
            return {
              ...propNode,
              width: null,
              height: null,
            };
          }
        }

        return propNode;
      });

      set({
        nodes: nextNodes,
      });
    },
    setEdges: (edges: Edge[]) => {
      set({ edges });
    },
    updateNodeDimensions: (updates: NodeDimensionUpdate[]) => {
      const { onNodesChange, nodes, transform } = get();

      const initialChanges: NodeChange[] = [];
      const nodesToChange: NodeChange[] = nodes.reduce((res, node) => {
        const update = updates.find((u) => u.id === node.id);
        if (update) {
          const dimensions = getDimensions(update.nodeElement);
          const doUpdate =
            dimensions.width &&
            dimensions.height &&
            (node.width !== dimensions.width || node.height !== dimensions.height || update.forceUpdate);

          if (doUpdate) {
            const handleBounds = getHandleBounds(update.nodeElement, transform[2]);
            const change = {
              id: node.id,
              type: 'dimensions',
              dimensions,
              handleBounds,
            } as NodeChange;
            res.push(change);
          }
        }

        return res;
      }, initialChanges);

      onNodesChange?.(nodesToChange);
    },
    updateNodePosition: ({ id, diff, isDragging }: NodeDiffUpdate) => {
      const { onNodesChange, nodes, nodeExtent } = get();

      if (onNodesChange) {
        const matchingNodes = nodes.filter((n) => n.id === id || n.isSelected);

        if (matchingNodes?.length) {
          onNodesChange(
            matchingNodes.map((n) => {
              const change: NodePositionChange = {
                id: n.id,
                type: 'position',
                isDragging: !!isDragging,
              };

              if (diff) {
                change.position = nodeExtent
                  ? clampPosition(
                      {
                        x: n.position.x + diff.x,
                        y: n.position.y + diff.y,
                      },
                      nodeExtent
                    )
                  : { x: n.position.x + diff.x, y: n.position.y + diff.y };
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
      const { userSelectionRect, nodes, edges, transform, onNodesChange, onEdgesChange } = get();
      const startX = userSelectionRect.startX ?? 0;
      const startY = userSelectionRect.startY ?? 0;

      const nextUserSelectRect = {
        ...userSelectionRect,
        x: mousePos.x < startX ? mousePos.x : userSelectionRect.x,
        y: mousePos.y < startY ? mousePos.y : userSelectionRect.y,
        width: Math.abs(mousePos.x - startX),
        height: Math.abs(mousePos.y - startY),
      };

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
      const { userSelectionRect, nodes } = get();
      const selectedNodes = nodes.filter((node) => node.isSelected);

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
      const { multiSelectionActive, onNodesChange, onEdgesChange, nodes, edges } = get();

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
      const { nodes, edges, onNodesChange, onEdgesChange } = get();
      const nodesToUnselect = nodes.map((n) => {
        n.isSelected = false;
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
    setTranslateExtent: (translateExtent: TranslateExtent) => {
      const { d3Zoom } = get();
      d3Zoom?.translateExtent(translateExtent);

      set({ translateExtent });
    },

    resetSelectedElements: () => {
      const { nodes, edges, onNodesChange, onEdgesChange } = get();

      const nodesToUnselect = nodes.filter((e) => e.isSelected).map(createNodeOrEdgeSelectionChange(false));
      const edgesToUnselect = edges.filter((e) => e.isSelected).map(createNodeOrEdgeSelectionChange(false));

      if (nodesToUnselect.length) {
        onNodesChange?.(nodesToUnselect as NodeChange[]);
      }
      if (edgesToUnselect.length) {
        onEdgesChange?.(edgesToUnselect as EdgeChange[]);
      }
    },
    setNodeExtent: (nodeExtent: NodeExtent) =>
      set({
        nodeExtent,
        nodes: get().nodes.map((node) => {
          return {
            ...node,
            position: clampPosition(node.position, nodeExtent),
          };
        }),
      }),
    unsetNodesSelection: () => set({ nodesSelectionActive: false }),
    updateTransform: (transform: Transform) => set({ transform }),
    updateSize: (size: Dimensions) => set({ width: size.width || 500, height: size.height || 500 }),
    setOnConnect: (onConnect: OnConnectFunc) => set({ onConnect }),
    setOnConnectStart: (onConnectStart: OnConnectStartFunc) => set({ onConnectStart }),
    setOnConnectStop: (onConnectStop: OnConnectStopFunc) => set({ onConnectStop }),
    setOnConnectEnd: (onConnectEnd: OnConnectEndFunc) => set({ onConnectEnd }),
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
  }));

export { Provider, useStore, createStore, useStoreApi };
