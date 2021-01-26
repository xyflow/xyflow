import { createStore, Action, action, Thunk, thunk, computed, Computed } from 'easy-peasy';
import isEqual from 'fast-deep-equal';
import { Selection as D3Selection, ZoomBehavior } from 'd3';

import { clampPosition, getDimensions } from '../utils';
import { getNodesInside, getConnectedEdges, getRectOfNodes, isNode, isEdge, parseElement } from '../utils/graph';
import { getHandleBounds } from '../components/Nodes/utils';

import {
  ElementId,
  Elements,
  Transform,
  Node,
  Edge,
  Rect,
  Dimensions,
  XYPosition,
  OnConnectFunc,
  OnConnectStartFunc,
  OnConnectStopFunc,
  OnConnectEndFunc,
  SelectionRect,
  HandleType,
  SetConnectionId,
  NodePosUpdate,
  NodeDiffUpdate,
  TranslateExtent,
  SnapGrid,
  ConnectionMode,
  NodeExtent,
} from '../types';

type NodeDimensionUpdate = {
  id: ElementId;
  nodeElement: HTMLDivElement;
};

type NodeDimensionUpdates = {
  updates: NodeDimensionUpdate[];
};

type InitD3Zoom = {
  d3Zoom: ZoomBehavior<Element, unknown>;
  d3Selection: D3Selection<Element, unknown, null, undefined>;
  d3ZoomHandler: ((this: Element, event: any, d: unknown) => void) | undefined;
  transform: Transform;
};

export interface StoreModel {
  width: number;
  height: number;
  transform: Transform;
  elements: Elements;
  nodes: Computed<StoreModel, Node[]>;
  edges: Computed<StoreModel, Edge[]>;
  selectedElements: Elements | null;
  selectedNodesBbox: Rect;
  viewportBox: Computed<StoreModel, Rect>;

  d3Zoom: ZoomBehavior<Element, unknown> | null;
  d3Selection: D3Selection<Element, unknown, null, undefined> | null;
  d3ZoomHandler: ((this: Element, event: any, d: unknown) => void) | undefined;
  minZoom: number;
  maxZoom: number;
  translateExtent: TranslateExtent;
  nodeExtent: NodeExtent;

  nodesSelectionActive: boolean;
  selectionActive: boolean;

  userSelectionRect: SelectionRect;

  connectionNodeId: ElementId | null;
  connectionHandleId: ElementId | null;
  connectionHandleType: HandleType | null;
  connectionPosition: XYPosition;
  connectionMode: ConnectionMode;

  snapToGrid: boolean;
  snapGrid: SnapGrid;

  nodesDraggable: boolean;
  nodesConnectable: boolean;
  elementsSelectable: boolean;

  multiSelectionActive: boolean;

  reactFlowVersion: string;

  onConnect?: OnConnectFunc;
  onConnectStart?: OnConnectStartFunc;
  onConnectStop?: OnConnectStopFunc;
  onConnectEnd?: OnConnectEndFunc;

  setOnConnect: Action<StoreModel, OnConnectFunc>;
  setOnConnectStart: Action<StoreModel, OnConnectStartFunc>;
  setOnConnectStop: Action<StoreModel, OnConnectStopFunc>;
  setOnConnectEnd: Action<StoreModel, OnConnectEndFunc>;

  setElements: Action<StoreModel, Elements>;

  batchUpdateNodeDimensions: Action<StoreModel, NodeDimensionUpdates>;
  updateNodeDimensions: Action<StoreModel, NodeDimensionUpdate>;

  updateNodePos: Action<StoreModel, NodePosUpdate>;
  updateNodePosDiff: Action<StoreModel, NodeDiffUpdate>;

  setSelection: Action<StoreModel, boolean>;

  unsetNodesSelection: Action<StoreModel>;
  resetSelectedElements: Action<StoreModel>;

  setSelectedElements: Action<StoreModel, Elements | Node | Edge>;
  addSelectedElements: Thunk<StoreModel, Elements | Node | Edge>;

  updateTransform: Action<StoreModel, Transform>;

  updateSize: Action<StoreModel, Dimensions>;

  initD3Zoom: Action<StoreModel, InitD3Zoom>;

  setMinZoom: Action<StoreModel, number>;
  setMaxZoom: Action<StoreModel, number>;

  setTranslateExtent: Action<StoreModel, TranslateExtent>;
  setNodeExtent: Action<StoreModel, NodeExtent>;

  setSnapToGrid: Action<StoreModel, boolean>;
  setSnapGrid: Action<StoreModel, SnapGrid>;

  setConnectionPosition: Action<StoreModel, XYPosition>;

  setConnectionNodeId: Action<StoreModel, SetConnectionId>;

  setInteractive: Action<StoreModel, boolean>;
  setNodesDraggable: Action<StoreModel, boolean>;
  setNodesConnectable: Action<StoreModel, boolean>;
  setElementsSelectable: Action<StoreModel, boolean>;

  setUserSelection: Action<StoreModel, XYPosition>;
  updateUserSelection: Action<StoreModel, XYPosition>;
  unsetUserSelection: Action<StoreModel>;

  setMultiSelectionActive: Action<StoreModel, boolean>;

  setConnectionMode: Action<StoreModel, ConnectionMode>;
}

export const storeModel: StoreModel = {
  width: 0,
  height: 0,
  transform: [0, 0, 1],
  elements: [],
  nodes: computed((state) => state.elements.filter(isNode)),
  edges: computed((state) => state.elements.filter(isEdge)),
  selectedElements: null,
  selectedNodesBbox: { x: 0, y: 0, width: 0, height: 0 },
  viewportBox: computed((state) => ({ x: 0, y: 0, width: state.width, height: state.height })),

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

  setOnConnect: action((state, onConnect) => {
    state.onConnect = onConnect;
  }),
  setOnConnectStart: action((state, onConnectStart) => {
    state.onConnectStart = onConnectStart;
  }),
  setOnConnectStop: action((state, onConnectStop) => {
    state.onConnectStop = onConnectStop;
  }),
  setOnConnectEnd: action((state, onConnectEnd) => {
    state.onConnectEnd = onConnectEnd;
  }),

  setElements: action((state, propElements) => {
    // remove deleted elements
    for (let i = 0; i < state.elements.length; i++) {
      const se = state.elements[i];
      const elementExistsInProps = propElements.find((pe) => pe.id === se.id);

      if (!elementExistsInProps) {
        state.elements.splice(i, 1);
        i--;
      }
    }

    propElements.forEach((el) => {
      const storeElementIndex = state.elements.findIndex((se) => se.id === el.id);

      // update existing element
      if (storeElementIndex !== -1) {
        const storeElement = state.elements[storeElementIndex];

        if (isNode(storeElement)) {
          const propNode = el as Node;
          const positionChanged =
            storeElement.position.x !== propNode.position.x || storeElement.position.y !== propNode.position.y;
          const typeChanged = typeof propNode.type !== 'undefined' && propNode.type !== storeElement.type;

          state.elements[storeElementIndex] = {
            ...storeElement,
            ...propNode,
          };

          if (positionChanged) {
            (state.elements[storeElementIndex] as Node).__rf.position = clampPosition(
              propNode.position,
              state.nodeExtent
            );
          }

          if (typeChanged) {
            // we reset the elements dimensions here in order to force a re-calculation of the bounds.
            // When the type of a node changes it is possible that the number or positions of handles changes too.
            (state.elements[storeElementIndex] as Node).__rf.width = null;
          }
        } else {
          state.elements[storeElementIndex] = {
            ...storeElement,
            ...el,
          };
        }
      } else {
        // add new element
        state.elements.push(parseElement(el, state.nodeExtent));
      }
    });
  }),

  batchUpdateNodeDimensions: action((state, { updates }) => {
    updates.forEach((update) => {
      const dimensions = getDimensions(update.nodeElement);
      const matchingIndex = state.elements.findIndex((n) => n.id === update.id);
      const matchingNode = state.elements[matchingIndex] as Node;

      if (
        matchingIndex !== -1 &&
        dimensions.width &&
        dimensions.height &&
        (matchingNode.__rf.width !== dimensions.width || matchingNode.__rf.height !== dimensions.height)
      ) {
        const handleBounds = getHandleBounds(update.nodeElement, state.transform[2]);

        (state.elements[matchingIndex] as Node).__rf.width = dimensions.width;
        (state.elements[matchingIndex] as Node).__rf.height = dimensions.height;
        (state.elements[matchingIndex] as Node).__rf.handleBounds = handleBounds;
      }
    });
  }),

  updateNodeDimensions: action((state, { id, nodeElement }) => {
    const dimensions = getDimensions(nodeElement);
    const matchingIndex = state.elements.findIndex((n) => n.id === id);

    if (matchingIndex !== -1 && dimensions.width && dimensions.height) {
      const handleBounds = getHandleBounds(nodeElement, state.transform[2]);

      (state.elements[matchingIndex] as Node).__rf.width = dimensions.width;
      (state.elements[matchingIndex] as Node).__rf.height = dimensions.height;
      (state.elements[matchingIndex] as Node).__rf.handleBounds = handleBounds;
    }
  }),

  updateNodePos: action((state, { id, pos }) => {
    let position: XYPosition = pos;

    if (state.snapToGrid) {
      const [gridSizeX, gridSizeY] = state.snapGrid;
      position = {
        x: gridSizeX * Math.round(pos.x / gridSizeX),
        y: gridSizeY * Math.round(pos.y / gridSizeY),
      };
    }

    state.elements.forEach((n) => {
      if (n.id === id && isNode(n)) {
        n.__rf.position = clampPosition(position, state.nodeExtent);
      }
    });
  }),

  updateNodePosDiff: action((state, { id = null, diff = null, isDragging = true }) => {
    state.elements.forEach((n) => {
      if (isNode(n) && (id === n.id || state.selectedElements?.find((sNode) => sNode.id === n.id))) {
        if (diff) {
          const position = {
            x: n.__rf.position.x + diff.x,
            y: n.__rf.position.y + diff.y,
          };
          n.__rf.position = clampPosition(position, state.nodeExtent);
        }
        n.__rf.isDragging = isDragging;
      }
    });
  }),

  setUserSelection: action((state, mousePos) => {
    state.userSelectionRect = {
      width: 0,
      height: 0,
      startX: mousePos.x,
      startY: mousePos.y,
      x: mousePos.x,
      y: mousePos.y,
      draw: true,
    };
    state.selectionActive = true;
  }),

  updateUserSelection: action((state, mousePos) => {
    const startX = state.userSelectionRect.startX || 0;
    const startY = state.userSelectionRect.startY || 0;

    const negativeX = mousePos.x < startX;
    const negativeY = mousePos.y < startY;
    const nextRect = {
      ...state.userSelectionRect,
      x: negativeX ? mousePos.x : state.userSelectionRect.x,
      y: negativeY ? mousePos.y : state.userSelectionRect.y,
      width: Math.abs(mousePos.x - startX),
      height: Math.abs(mousePos.y - startY),
    };

    const selectedNodes = getNodesInside(state.nodes, nextRect, state.transform);
    const selectedEdges = getConnectedEdges(selectedNodes, state.edges);

    const nextSelectedElements = [...selectedNodes, ...selectedEdges];
    const selectedElementsUpdated = !isEqual(nextSelectedElements, state.selectedElements);

    state.userSelectionRect = nextRect;

    if (selectedElementsUpdated) {
      state.selectedElements = nextSelectedElements.length > 0 ? nextSelectedElements : null;
    }
  }),

  unsetUserSelection: action((state) => {
    const selectedNodes = state.selectedElements?.filter((node) => isNode(node) && node.__rf) as Node[];

    if (!selectedNodes || selectedNodes.length === 0) {
      state.selectionActive = false;
      state.userSelectionRect.draw = false;
      state.nodesSelectionActive = false;
      state.selectedElements = null;

      return;
    }

    const selectedNodesBbox = getRectOfNodes(selectedNodes);

    state.nodesSelectionActive = true;
    state.selectedNodesBbox = selectedNodesBbox;

    state.userSelectionRect.draw = false;
    state.selectionActive = false;
  }),

  setSelection: action((state, isActive) => {
    state.selectionActive = isActive;
  }),

  unsetNodesSelection: action((state) => {
    state.nodesSelectionActive = false;
  }),

  resetSelectedElements: action((state) => {
    state.selectedElements = null;
  }),

  setSelectedElements: action((state, elements) => {
    const selectedElementsArr = Array.isArray(elements) ? elements : [elements];
    const selectedElementsUpdated = !isEqual(selectedElementsArr, state.selectedElements);
    const selectedElements = selectedElementsUpdated ? selectedElementsArr : state.selectedElements;

    state.selectedElements = selectedElements;
  }),

  addSelectedElements: thunk((actions, elements, helpers) => {
    const { multiSelectionActive, selectedElements } = helpers.getState();
    const selectedElementsArr = Array.isArray(elements) ? elements : [elements];

    if (multiSelectionActive) {
      const nextElements = selectedElements ? [...selectedElements, ...selectedElementsArr] : selectedElementsArr;
      actions.setSelectedElements(nextElements);

      return;
    }

    actions.setSelectedElements(elements);
  }),

  updateTransform: action((state, transform) => {
    state.transform[0] = transform[0];
    state.transform[1] = transform[1];
    state.transform[2] = transform[2];
  }),

  updateSize: action((state, size) => {
    // when parent has no size we use these default values
    // so that the calculations don't throw any errors
    state.width = size.width || 500;
    state.height = size.height || 500;
  }),

  initD3Zoom: action((state, { d3Zoom, d3Selection, d3ZoomHandler, transform }) => {
    state.d3Zoom = d3Zoom;
    state.d3Selection = d3Selection;
    state.d3ZoomHandler = d3ZoomHandler;

    state.transform[0] = transform[0];
    state.transform[1] = transform[1];
    state.transform[2] = transform[2];
  }),

  setMinZoom: action((state, minZoom) => {
    state.minZoom = minZoom;

    if (state.d3Zoom) {
      state.d3Zoom.scaleExtent([minZoom, state.maxZoom]);
    }
  }),

  setMaxZoom: action((state, maxZoom) => {
    state.maxZoom = maxZoom;

    if (state.d3Zoom) {
      state.d3Zoom.scaleExtent([state.minZoom, maxZoom]);
    }
  }),

  setTranslateExtent: action((state, translateExtent) => {
    state.translateExtent = translateExtent;

    if (state.d3Zoom) {
      state.d3Zoom.translateExtent(translateExtent);
    }
  }),

  setNodeExtent: action((state, nodeExtent) => {
    state.nodeExtent = nodeExtent;

    state.elements.forEach((el) => {
      if (isNode(el)) {
        el.__rf.position = clampPosition(el.__rf.position, nodeExtent);
      }
    });
  }),

  setConnectionPosition: action((state, position) => {
    state.connectionPosition = position;
  }),

  setConnectionNodeId: action((state, { connectionNodeId, connectionHandleId, connectionHandleType }) => {
    state.connectionNodeId = connectionNodeId;
    state.connectionHandleId = connectionHandleId;
    state.connectionHandleType = connectionHandleType;
  }),

  setSnapToGrid: action((state, snapToGrid) => {
    state.snapToGrid = snapToGrid;
  }),

  setSnapGrid: action((state, snapGrid) => {
    state.snapGrid[0] = snapGrid[0];
    state.snapGrid[1] = snapGrid[1];
  }),

  setInteractive: action((state, isInteractive) => {
    state.nodesDraggable = isInteractive;
    state.nodesConnectable = isInteractive;
    state.elementsSelectable = isInteractive;
  }),

  setNodesDraggable: action((state, nodesDraggable) => {
    state.nodesDraggable = nodesDraggable;
  }),

  setNodesConnectable: action((state, nodesConnectable) => {
    state.nodesConnectable = nodesConnectable;
  }),

  setElementsSelectable: action((state, elementsSelectable) => {
    state.elementsSelectable = elementsSelectable;
  }),

  setMultiSelectionActive: action((state, isActive) => {
    state.multiSelectionActive = isActive;
  }),

  setConnectionMode: action((state, connectionMode) => {
    state.connectionMode = connectionMode;
  }),
};

const nodeEnv: string = (typeof __ENV__ !== 'undefined' && __ENV__) as string;
const store = createStore(storeModel, { devTools: nodeEnv === 'development' });

export default store;
