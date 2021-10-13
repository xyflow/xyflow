import create from 'zustand';
import createContext from 'zustand/context';
import isEqual from 'fast-deep-equal';

import { clampPosition, getDimensions } from '../utils';
import {
  ReactFlowState,
  ConnectionMode,
  Node,
  Edge,
  ElementChange,
  NodeDimensionUpdate,
  NodeDiffUpdate,
  XYPosition,
  Elements,
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
  OnElementsChange,
} from '../types';
import { parseNode, parseEdge, isNode, getRectOfNodes, getNodesInside, getConnectedEdges } from '../utils/graph';
import { getSourceTargetNodes } from '../container/EdgeRenderer/utils';
import { getHandleBounds } from '../components/Nodes/utils';

const { Provider, useStore, useStoreApi } = createContext<ReactFlowState>();

const createStore = () =>
  create<ReactFlowState>((set, get) => ({
    width: 0,
    height: 0,
    transform: [0, 0, 1],
    nodes: [],
    edges: [],
    onNodesChange: null,
    onEdgesChange: null,

    selectedElements: null,
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
      const { nodes, edges, nodeExtent } = get();
      const nextNodes = propNodes.map((propNode: Node) => {
        const storeNode = nodes.find((node) => node.id === propNode.id);

        if (storeNode) {
          if (typeof propNode.type !== 'undefined' && propNode.type !== storeNode.type) {
            const updatedNode: Node = {
              ...storeNode,
              ...propNode,
            };
            // we reset the elements dimensions here in order to force a re-calculation of the bounds.
            // When the type of a node changes it is possible that the number or positions of handles changes too.
            updatedNode.width = null;
            return updatedNode;
          }
        }

        return parseNode(propNode, nodeExtent);
      });

      const updatedEdges = edges.map((edge) => {
        const { sourceNode, targetNode } = getSourceTargetNodes(edge, nextNodes);

        if (sourceNode) {
          edge.sourceNode = sourceNode;
        }
        if (targetNode) {
          edge.targetNode = targetNode;
        }

        return edge;
      });

      set({
        nodes: nextNodes,
        edges: updatedEdges,
      });
    },
    setEdges: (propEdges: Edge[]) => {
      const { edges, nodes } = get();

      const nextEdges = propEdges.map((propEdge: Edge) => {
        const storeEdge = edges.find((se) => se.id === propEdge.id);

        if (storeEdge) {
          return parseEdge(propEdge);
        } else {
          const parsedEdge = parseEdge(propEdge);
          const { sourceNode, targetNode } = getSourceTargetNodes(parsedEdge, nodes);

          if (sourceNode) {
            parsedEdge.sourceNode = sourceNode;
          }
          if (targetNode) {
            parsedEdge.targetNode = targetNode;
          }

          return parsedEdge;
        }
      });

      set({ edges: nextEdges });
    },
    updateNodeDimensions: (updates: NodeDimensionUpdate[]) => {
      const { onNodesChange, nodes, transform } = get();

      const initialChanges: ElementChange[] = [];
      const nodesToChange: ElementChange[] = nodes.reduce((res, node) => {
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
              change: {
                ...dimensions,
                handleBounds,
              },
            } as ElementChange;

            res.push(change);
          }
        }

        return res;
      }, initialChanges);

      if (onNodesChange) {
        onNodesChange(nodesToChange);
      }
    },
    updateNodePosDiff: ({ id, diff, isDragging }: NodeDiffUpdate) => {
      const { onNodesChange, nodes } = get();

      if (onNodesChange && id && diff) {
        const matchingNode = nodes.find((n) => n.id === id);

        if (matchingNode) {
          requestAnimationFrame(() =>
            onNodesChange([
              {
                id,
                change: {
                  position: {
                    x: matchingNode.position.x + diff.x,
                    y: matchingNode.position.y + diff.y,
                    isDragging,
                  },
                },
              },
            ])
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
      const { userSelectionRect, nodes, edges, transform, selectedElements } = get();
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
      const selectedEdges = getConnectedEdges(selectedNodes, edges);

      const nextSelectedElements = [...selectedNodes, ...selectedEdges];
      const selectedElementsChanged = !isEqual(nextSelectedElements, selectedElements);

      if (selectedElementsChanged) {
        set({
          selectedElements: nextSelectedElements.length > 0 ? nextSelectedElements : null,
          userSelectionRect: nextUserSelectRect,
        });
      } else {
        set({
          userSelectionRect: nextUserSelectRect,
        });
      }
    },
    unsetUserSelection: () => {
      const { selectedElements, userSelectionRect } = get();
      const selectedNodes = selectedElements?.filter((node) => isNode(node) && node.position) as Node[];

      const stateUpdate = {
        selectionActive: false,
        userSelectionRect: {
          ...userSelectionRect,
          draw: false,
        },
        selectedElements: null,
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
    setSelectedElements: (elements: Elements) => {
      const { selectedElements } = get();
      const selectedElementsArr = Array.isArray(elements) ? elements : [elements];
      const selectedElementsUpdated = !isEqual(selectedElementsArr, selectedElements);

      set({
        selectedElements: selectedElementsUpdated ? selectedElementsArr : selectedElements,
      });
    },
    addSelectedElements: (elements: Elements) => {
      const { multiSelectionActive, selectedElements } = get();
      const selectedElementsArr = Array.isArray(elements) ? elements : [elements];

      let nextElements = selectedElementsArr;

      if (multiSelectionActive) {
        nextElements = selectedElements ? [...selectedElements, ...selectedElementsArr] : selectedElementsArr;
      }

      const selectedElementsUpdated = !isEqual(nextElements, selectedElements);

      set({ selectedElements: selectedElementsUpdated ? nextElements : selectedElements });
    },
    initD3Zoom: ({ d3Zoom, d3Selection, d3ZoomHandler, transform }: InitD3ZoomPayload) => {
      set({
        d3Zoom,
        d3Selection,
        d3ZoomHandler,
        transform,
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
    setTranslateExtent: (translateExtent: TranslateExtent) => {
      const { d3Zoom } = get();
      d3Zoom?.translateExtent(translateExtent);

      set({ translateExtent });
    },
    setNodeExtent: (nodeExtent: NodeExtent) => {
      set({
        nodeExtent,
        nodes: get().nodes.map((node) => {
          return {
            ...node,
            position: clampPosition(node.position, nodeExtent),
            __rf: {
              ...node.__rf,
            },
          };
        }),
      });
    },
    unsetNodesSelection: () => {
      set({ nodesSelectionActive: false });
    },
    resetSelectedElements: () => {
      set({ selectedElements: null });
    },
    updateTransform: (transform: Transform) => {
      set({ transform });
    },
    updateSize: (size: Dimensions) => {
      set({ width: size.width || 500, height: size.height || 500 });
    },
    setOnConnect: (onConnect: OnConnectFunc) => {
      set({ onConnect });
    },
    setOnConnectStart: (onConnectStart: OnConnectStartFunc) => {
      set({ onConnectStart });
    },
    setOnConnectStop: (onConnectStop: OnConnectStopFunc) => {
      set({ onConnectStop });
    },
    setOnConnectEnd: (onConnectEnd: OnConnectEndFunc) => {
      set({ onConnectEnd });
    },
    setConnectionPosition: (connectionPosition: XYPosition) => {
      set({ connectionPosition });
    },
    setConnectionNodeId: (params: SetConnectionId) => {
      set({ ...params });
    },
    setSnapToGrid: (snapToGrid: boolean) => {
      set({ snapToGrid });
    },
    setSnapGrid: (snapGrid: SnapGrid) => {
      set({ snapGrid });
    },
    setInteractive: (isInteractive: boolean) => {
      set({
        nodesDraggable: isInteractive,
        nodesConnectable: isInteractive,
        elementsSelectable: isInteractive,
      });
    },
    setNodesDraggable: (nodesDraggable: boolean) => {
      set({ nodesDraggable });
    },
    setNodesConnectable: (nodesConnectable: boolean) => {
      set({ nodesConnectable });
    },
    setElementsSelectable: (elementsSelectable: boolean) => {
      set({ elementsSelectable });
    },
    setMultiSelectionActive: (multiSelectionActive: boolean) => {
      set({ multiSelectionActive });
    },
    setConnectionMode: (connectionMode: ConnectionMode) => {
      set({ connectionMode });
    },
    setOnNodesChange: (onNodesChange: OnElementsChange) => {
      set({ onNodesChange });
    },
    setOnEdgesChange: (onEdgesChange: OnElementsChange) => {
      set({ onEdgesChange });
    },
  }));

export { Provider, useStore, createStore, useStoreApi };
