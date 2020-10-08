import { createStore, Action, action, Thunk, thunk, computed, Computed } from 'easy-peasy';
import isEqual from 'fast-deep-equal';
import { Selection as D3Selection, ZoomBehavior } from 'd3';
import { zoom, zoomIdentity } from 'd3-zoom';
import { select } from 'd3-selection';

import { getDimensions, clamp } from '../utils';
import { getHandleBounds } from '../components/Nodes/utils';

import { getNodesInside, getConnectedEdges, getRectOfNodes, isNode, isEdge } from '../utils/graph';
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
  FitViewParams,
  TranslateExtent,
  SnapGrid,
} from '../types';

type TransformXYK = {
  x: number;
  y: number;
  k: number;
};

type NodeDimensionUpdate = {
  id: ElementId;
  nodeElement: HTMLDivElement;
};

type InitD3 = {
  zoomPane: Element;
  defaultPosition: [number, number];
  defaultZoom: number;
  translateExtent?: TranslateExtent;
};
export interface StoreModel {
  width: number;
  height: number;
  viewportBox: Computed<StoreModel, Rect>;
  transform: Transform;
  elements: Elements;
  nodes: Computed<StoreModel, Node[]>;
  edges: Computed<StoreModel, Edge[]>;
  selectedElements: Elements | null;
  selectedNodesBbox: Rect;

  d3Zoom: ZoomBehavior<Element, unknown> | null;
  d3Selection: D3Selection<Element, unknown, null, undefined> | null;
  d3Initialised: boolean;
  minZoom: number;
  maxZoom: number;
  translateExtent: TranslateExtent;

  nodesSelectionActive: boolean;
  selectionActive: boolean;

  userSelectionRect: SelectionRect;

  connectionNodeId: ElementId | null;
  connectionHandleType: HandleType | null;
  connectionPosition: XYPosition;

  snapToGrid: boolean;
  snapGrid: SnapGrid;

  nodesDraggable: boolean;
  nodesConnectable: boolean;
  elementsSelectable: boolean;

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

  updateNodeDimensions: Action<StoreModel, NodeDimensionUpdate>;

  updateNodePos: Action<StoreModel, NodePosUpdate>;
  updateNodePosDiff: Action<StoreModel, NodeDiffUpdate>;

  setSelection: Action<StoreModel, boolean>;

  unsetNodesSelection: Action<StoreModel>;

  setSelectedElements: Action<StoreModel, Elements | Node | Edge>;

  updateTransform: Action<StoreModel, TransformXYK>;

  setInitTransform: Action<StoreModel, TransformXYK>;

  updateSize: Action<StoreModel, Dimensions>;

  initD3: Action<StoreModel, InitD3>;

  setMinZoom: Action<StoreModel, number>;
  setMaxZoom: Action<StoreModel, number>;

  setTranslateExtent: Action<StoreModel, TranslateExtent>;

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

  fitView: Action<StoreModel, FitViewParams>;
  zoomTo: Action<StoreModel, number>;
  zoom: Thunk<StoreModel, number, any, StoreModel>;
  zoomIn: Thunk<StoreModel>;
  zoomOut: Thunk<StoreModel>;
}

export const storeModel: StoreModel = {
  width: 0,
  height: 0,
  viewportBox: computed((state) => ({ x: 0, y: 0, width: state.width, height: state.height })),
  transform: [0, 0, 1],
  elements: [],
  nodes: computed((state) => state.elements.filter((el) => isNode(el)) as Node[]),
  edges: computed((state) => state.elements.filter((el) => isEdge(el)) as Edge[]),
  selectedElements: null,
  selectedNodesBbox: { x: 0, y: 0, width: 0, height: 0 },

  d3Zoom: null,
  d3Selection: null,
  d3Initialised: false,
  minZoom: 0.5,
  maxZoom: 2,
  translateExtent: [
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
  connectionHandleType: 'source',
  connectionPosition: { x: 0, y: 0 },

  snapGrid: [15, 15],
  snapToGrid: false,

  nodesDraggable: true,
  nodesConnectable: true,
  elementsSelectable: true,

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

  setElements: action((state, elements) => {
    state.elements = elements;
  }),

  updateNodeDimensions: action((state, { id, nodeElement }) => {
    const dimensions = getDimensions(nodeElement);
    const matchingNode = state.nodes.find((n) => n.id === id);

    // only update when size change
    if (
      !matchingNode ||
      (matchingNode.__rf.width === dimensions.width && matchingNode.__rf.height === dimensions.height)
    ) {
      return;
    }

    const bounds = nodeElement.getBoundingClientRect();
    const handleBounds = {
      source: getHandleBounds('.source', nodeElement, bounds, state.transform[2]),
      target: getHandleBounds('.target', nodeElement, bounds, state.transform[2]),
    };

    state.elements.forEach((n) => {
      if (n.id === id && isNode(n)) {
        n.__rf.width = dimensions.width;
        n.__rf.height = dimensions.height;
        n.__rf.handleBounds = handleBounds;
      }
    });
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
        n.__rf.position = position;
      }
    });
  }),

  updateNodePosDiff: action((state, { id, diff = null, isDragging = true }) => {
    state.elements.forEach((n) => {
      if (n.id === id && isNode(n)) {
        if (diff) {
          n.__rf.position = {
            x: n.__rf.position.x + diff.x,
            y: n.__rf.position.y + diff.y,
          };
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
      width: negativeX ? startX - mousePos.x : mousePos.x - startX,
      height: negativeY ? startY - mousePos.y : mousePos.y - startY,
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
    const selectedNodes = state.selectedElements?.filter(isNode);

    if (!selectedNodes) {
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
    state.selectedElements = null;
  }),

  setSelectedElements: action((state, elements) => {
    const selectedElementsArr = Array.isArray(elements) ? elements : [elements];
    const selectedElementsUpdated = !isEqual(selectedElementsArr, state.selectedElements);
    const selectedElements = selectedElementsUpdated ? selectedElementsArr : state.selectedElements;

    state.selectedElements = selectedElements;
  }),

  updateTransform: action((state, transform) => {
    state.transform[0] = transform.x;
    state.transform[1] = transform.y;
    state.transform[2] = transform.k;
  }),

  setInitTransform: action((state, transform) => {
    state.transform[0] = transform.x;
    state.transform[1] = transform.y;
    state.transform[2] = transform.k;

    if (state.d3Selection) {
      const updatedTransform = zoomIdentity.translate(transform.x, transform.y).scale(transform.k);
      // we need to sync the d3 zoom transform with the updated transform
      state.d3Selection.property('__zoom', updatedTransform);
    }
  }),

  updateSize: action((state, size) => {
    // when parent has no size we use these default values
    // so that the calculations don't throw any errors
    state.width = size.width || 500;
    state.height = size.height || 500;
  }),

  initD3: action((state, { zoomPane, defaultPosition, defaultZoom, translateExtent }) => {
    const currentTranslateExtent = typeof translateExtent !== 'undefined' ? translateExtent : state.translateExtent;
    const d3ZoomInstance = zoom().scaleExtent([state.minZoom, state.maxZoom]).translateExtent(currentTranslateExtent);
    const selection = select(zoomPane).call(d3ZoomInstance);

    const clampedX = clamp(defaultPosition[0], currentTranslateExtent[0][0], currentTranslateExtent[1][0]);
    const clampedY = clamp(defaultPosition[1], currentTranslateExtent[0][1], currentTranslateExtent[1][1]);
    const clampedZoom = clamp(defaultZoom, state.minZoom, state.maxZoom);

    const updatedTransform = zoomIdentity.translate(clampedX, clampedY).scale(clampedZoom);
    selection.property('__zoom', updatedTransform);

    state.transform[0] = clampedX;
    state.transform[1] = clampedY;
    state.transform[2] = clampedZoom;
    state.d3Zoom = d3ZoomInstance;
    state.d3Selection = selection;
    state.d3Initialised = true;
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

  setConnectionPosition: action((state, position) => {
    state.connectionPosition = position;
  }),

  setConnectionNodeId: action((state, { connectionNodeId, connectionHandleType }) => {
    state.connectionNodeId = connectionNodeId;
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

  fitView: action((state, payload = { padding: 0.1 }) => {
    const { padding } = payload;
    const { nodes, width, height, d3Selection, minZoom, maxZoom } = state;

    if (!d3Selection || !nodes.length) {
      return;
    }

    const bounds = getRectOfNodes(nodes);
    const xZoom = width / (bounds.width * (1 + padding));
    const yZoom = height / (bounds.height * (1 + padding));
    const zoom = Math.min(xZoom, yZoom);
    const clampedZoom = clamp(zoom, minZoom, maxZoom);
    const boundsCenterX = bounds.x + bounds.width / 2;
    const boundsCenterY = bounds.y + bounds.height / 2;
    const transform = [width / 2 - boundsCenterX * clampedZoom, height / 2 - boundsCenterY * clampedZoom];
    const fittedTransform = zoomIdentity.translate(transform[0], transform[1]).scale(clampedZoom);

    // we need to sync the d3 zoom transform with the fitted transform
    d3Selection.property('__zoom', fittedTransform);

    state.transform[0] = fittedTransform.x;
    state.transform[1] = fittedTransform.y;
    state.transform[2] = fittedTransform.k;
  }),

  zoomTo: action((state, zoomLevel) => {
    const { d3Selection, transform, minZoom, maxZoom } = state;
    const nextZoom = clamp(zoomLevel, minZoom, maxZoom);

    if (d3Selection) {
      // we want to zoom in and out to the center of the zoom pane
      const center = [state.width / 2, state.height / 2];
      const centerInverted = [(center[0] - transform[0]) / transform[2], (center[1] - transform[1]) / transform[2]];
      const x = center[0] - centerInverted[0] * nextZoom;
      const y = center[1] - centerInverted[1] * nextZoom;
      const zoomedTransform = zoomIdentity.translate(x, y).scale(nextZoom);

      // we need to sync the d3 zoom transform with the zoomed transform
      d3Selection.property('__zoom', zoomedTransform);

      state.transform[0] = zoomedTransform.x;
      state.transform[1] = zoomedTransform.y;
      state.transform[2] = zoomedTransform.k;
    }
  }),

  zoom: thunk((actions, amount, helpers) => {
    const { transform } = helpers.getState();
    const nextZoom = transform[2] + amount;

    actions.zoomTo(nextZoom);
  }),

  zoomIn: thunk((actions) => {
    actions.zoom(0.2);
  }),

  zoomOut: thunk((actions) => {
    actions.zoom(-0.2);
  }),
};

const nodeEnv: string = process.env.NODE_ENV as string;
const store = createStore(storeModel, { devTools: nodeEnv === 'development' });

export default store;
