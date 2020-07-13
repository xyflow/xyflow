import { createStore, Action, action, Thunk, thunk } from 'easy-peasy';
import isEqual from 'fast-deep-equal';
import { Selection as D3Selection, ZoomBehavior } from 'd3';
import { zoom, zoomIdentity, zoomTransform } from 'd3-zoom';
import { select } from 'd3-selection';

import { getDimensions } from '../utils';
import { getHandleBounds } from '../components/Nodes/utils';

import { getNodesInside, getConnectedEdges, getRectOfNodes } from '../utils/graph';
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
  SelectionRect,
  HandleType,
  SetConnectionId,
  NodePosUpdate,
  FitViewParams,
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

type SelectionUpdate = {
  isActive: boolean;
  selection?: SelectionRect;
};

type SetMinMaxZoom = {
  minZoom: number;
  maxZoom: number;
};

type SetSnapGrid = {
  snapToGrid: boolean;
  snapGrid: [number, number];
};

export interface StoreModel {
  width: number;
  height: number;
  transform: Transform;
  nodes: Node[];
  edges: Edge[];
  selectedElements: Elements | null;
  selectedNodesBbox: Rect;

  d3Zoom: ZoomBehavior<Element, unknown> | null;
  d3Selection: D3Selection<Element, unknown, null, undefined> | null;
  d3Initialised: boolean;
  minZoom: number;
  maxZoom: number;

  nodesSelectionActive: boolean;
  selectionActive: boolean;
  selection: SelectionRect | null;

  userSelectionRect: SelectionRect;

  connectionNodeId: ElementId | null;
  connectionHandleType: HandleType | null;
  connectionPosition: XYPosition;

  snapToGrid: boolean;
  snapGrid: [number, number];

  nodesDraggable: boolean;
  nodesConnectable: boolean;
  elementsSelectable: boolean;

  reactFlowVersion: string;

  onConnect: OnConnectFunc;

  setOnConnect: Action<StoreModel, OnConnectFunc>;

  setNodes: Action<StoreModel, Node[]>;

  setEdges: Action<StoreModel, Edge[]>;

  updateNodeDimensions: Action<StoreModel, NodeDimensionUpdate>;

  updateNodePos: Action<StoreModel, NodePosUpdate>;

  setSelection: Action<StoreModel, boolean>;

  setNodesSelection: Action<StoreModel, SelectionUpdate>;

  setSelectedElements: Action<StoreModel, Elements | Node | Edge>;

  updateTransform: Action<StoreModel, TransformXYK>;

  updateSize: Action<StoreModel, Dimensions>;

  initD3: Action<StoreModel, Element>;

  setMinMaxZoom: Action<StoreModel, SetMinMaxZoom>;

  setSnapGrid: Action<StoreModel, SetSnapGrid>;

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
  zoom: Action<StoreModel, number>;
  zoomIn: Thunk<StoreModel>;
  zoomOut: Thunk<StoreModel>;
}

export const storeModel: StoreModel = {
  width: 0,
  height: 0,
  transform: [0, 0, 1],
  nodes: [],
  edges: [],
  selectedElements: null,
  selectedNodesBbox: { x: 0, y: 0, width: 0, height: 0 },

  d3Zoom: null,
  d3Selection: null,
  d3Initialised: false,
  minZoom: 0.5,
  maxZoom: 2,

  nodesSelectionActive: false,
  selectionActive: false,
  selection: null,

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

  snapGrid: [16, 16],
  snapToGrid: false,

  nodesDraggable: true,
  nodesConnectable: true,
  elementsSelectable: true,

  reactFlowVersion: typeof __REACT_FLOW_VERSION__ !== 'undefined' ? __REACT_FLOW_VERSION__ : '-',

  onConnect: () => {},

  setOnConnect: action((state, onConnect) => {
    state.onConnect = onConnect;
  }),

  setNodes: action((state, nodes) => {
    state.nodes = nodes;
  }),

  setEdges: action((state, edges) => {
    state.edges = edges;
  }),

  updateNodeDimensions: action((state, { id, nodeElement }) => {
    const bounds = nodeElement.getBoundingClientRect();
    const dimensions = getDimensions(nodeElement);
    const matchingNode = state.nodes.find((n) => n.id === id);

    // only update when size change
    if (
      !matchingNode ||
      (matchingNode.__rf.width === dimensions.width && matchingNode.__rf.height === dimensions.height)
    ) {
      return;
    }

    const handleBounds = {
      source: getHandleBounds('.source', nodeElement, bounds, state.transform[2]),
      target: getHandleBounds('.target', nodeElement, bounds, state.transform[2]),
    };

    state.nodes.forEach((n) => {
      if (n.id === id) {
        n.__rf = {
          ...n.__rf,
          ...dimensions,
          handleBounds,
        };
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

    state.nodes.forEach((n) => {
      if (n.id === id) {
        n.__rf = {
          ...n.__rf,
          position,
        };
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

    state.selection = nextRect;
    state.userSelectionRect = nextRect;

    if (selectedElementsUpdated) {
      state.selectedElements = nextSelectedElements.length > 0 ? nextSelectedElements : null;
    }
  }),

  unsetUserSelection: action((state) => {
    const selectedNodes = getNodesInside(state.nodes, state.userSelectionRect, state.transform);

    if (!selectedNodes.length) {
      state.selectionActive = false;
      state.userSelectionRect = { ...state.userSelectionRect, draw: false };
      state.nodesSelectionActive = false;
      state.selectedElements = null;

      return;
    }

    const selectedNodesBbox = getRectOfNodes(selectedNodes);

    state.selection = state.userSelectionRect;
    state.nodesSelectionActive = true;
    state.selectedNodesBbox = selectedNodesBbox;

    state.userSelectionRect = { ...state.userSelectionRect, draw: false };
    state.selectionActive = false;
  }),

  setSelection: action((state, isActive) => {
    state.selectionActive = isActive;
  }),

  setNodesSelection: action((state, { isActive, selection }) => {
    if (!isActive || typeof selection === 'undefined') {
      state.nodesSelectionActive = false;
      state.selectedElements = null;

      return;
    }
    const selectedNodes = getNodesInside(state.nodes, selection, state.transform);

    if (!selectedNodes.length) {
      state.nodesSelectionActive = false;
      state.selectedElements = null;

      return;
    }

    const selectedNodesBbox = getRectOfNodes(selectedNodes);

    state.selection = selection;
    state.nodesSelectionActive = true;
    state.selectedNodesBbox = selectedNodesBbox;
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

  updateSize: action((state, size) => {
    state.width = size.width;
    state.height = size.height;
  }),

  initD3: action((state, zoomPaneNode) => {
    const d3ZoomInstance = zoom().scaleExtent([state.minZoom, state.maxZoom]);
    const selection = select(zoomPaneNode).call(d3ZoomInstance);

    state.d3Zoom = d3ZoomInstance;
    state.d3Selection = selection;
    state.d3Initialised = true;
  }),

  setMinMaxZoom: action((state, { minZoom, maxZoom }) => {
    state.minZoom = minZoom;
    state.maxZoom = maxZoom;

    if (state.d3Zoom) {
      state.d3Zoom.scaleExtent([minZoom, maxZoom]);
    }
  }),

  setConnectionPosition: action((state, position) => {
    state.connectionPosition = position;
  }),

  setConnectionNodeId: action((state, { connectionNodeId, connectionHandleType }) => {
    state.connectionNodeId = connectionNodeId;
    state.connectionHandleType = connectionHandleType;
  }),

  setSnapGrid: action((state, { snapToGrid, snapGrid }) => {
    state.snapToGrid = snapToGrid;
    state.snapGrid = snapGrid;
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
    const { nodes, width, height, d3Selection, d3Zoom } = state;

    if (!d3Selection || !d3Zoom || !nodes.length) {
      return;
    }

    const bounds = getRectOfNodes(nodes);
    const maxBoundsSize = Math.max(bounds.width, bounds.height);
    const k = Math.min(width, height) / (maxBoundsSize + maxBoundsSize * padding);
    const boundsCenterX = bounds.x + bounds.width / 2;
    const boundsCenterY = bounds.y + bounds.height / 2;
    const transform = [width / 2 - boundsCenterX * k, height / 2 - boundsCenterY * k];
    const fittedTransform = zoomIdentity.translate(transform[0], transform[1]).scale(k);

    d3Selection.call(d3Zoom.transform, fittedTransform);

    state.transform = [fittedTransform.x, fittedTransform.y, fittedTransform.k];
  }),

  zoom: action((state, amount) => {
    const { d3Zoom, d3Selection, transform } = state;
    const nextZoom = transform[2] + amount;

    if (d3Zoom && d3Selection) {
      d3Zoom.scaleTo(d3Selection, nextZoom);
      const transforms = zoomTransform(d3Selection.node() as Element);
      state.transform = [transforms.x, transforms.y, transforms.k];
    }
  }),

  zoomIn: thunk((actions) => {
    actions.zoom(0.2);
  }),

  zoomOut: thunk((actions) => {
    actions.zoom(-0.2);
  }),
};

const store = createStore(storeModel);

export default store;
