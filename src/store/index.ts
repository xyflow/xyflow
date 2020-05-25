import { createStore, Action, action } from 'easy-peasy';
import isEqual from 'fast-deep-equal';
import { Selection as D3Selection, ZoomBehavior } from 'd3';

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
} from '../types';

type TransformXYK = {
  x: number;
  y: number;
  k: number;
};

type NodePosUpdate = {
  id: ElementId;
  pos: XYPosition;
};

type NodeDimensionUpdate = {
  id: ElementId;
  nodeElement: HTMLDivElement;
};

type SelectionUpdate = {
  isActive: boolean;
  selection?: SelectionRect;
};

type D3Init = {
  zoom: ZoomBehavior<Element, unknown>;
  selection: D3Selection<Element, unknown, null, undefined>;
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

  nodesSelectionActive: boolean;
  selectionActive: boolean;
  selection: SelectionRect | null;

  userSelectionRect: SelectionRect;

  connectionSourceId: ElementId | null;
  connectionPosition: XYPosition;

  snapToGrid: boolean;
  snapGrid: [number, number];

  isInteractive: boolean;

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

  initD3: Action<StoreModel, D3Init>;

  setSnapGrid: Action<StoreModel, SetSnapGrid>;

  setConnectionPosition: Action<StoreModel, XYPosition>;

  setConnectionSourceId: Action<StoreModel, ElementId | null>;

  setInteractive: Action<StoreModel, boolean>;

  setUserSelection: Action<StoreModel, XYPosition>;
  updateUserSelection: Action<StoreModel, XYPosition>;
  unsetUserSelection: Action<StoreModel>;
}

const storeModel: StoreModel = {
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
  connectionSourceId: null,
  connectionPosition: { x: 0, y: 0 },

  snapGrid: [16, 16],
  snapToGrid: false,

  isInteractive: true,

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
      (matchingNode.__rg.width === dimensions.width && matchingNode.__rg.height === dimensions.height)
    ) {
      return;
    }

    const handleBounds = {
      source: getHandleBounds('.source', nodeElement, bounds, state.transform[2]),
      target: getHandleBounds('.target', nodeElement, bounds, state.transform[2]),
    };

    state.nodes.forEach((n) => {
      if (n.id === id) {
        n.__rg = {
          ...n.__rg,
          ...dimensions,
          handleBounds,
        };
      }
    });
  }),

  updateNodePos: action((state, { id, pos }) => {
    let position: XYPosition = pos;

    if (state.snapToGrid) {
      const transformedGridSizeX = state.snapGrid[0] * state.transform[2];
      const transformedGridSizeY = state.snapGrid[1] * state.transform[2];

      position = {
        x: transformedGridSizeX * Math.round(pos.x / transformedGridSizeX),
        y: transformedGridSizeY * Math.round(pos.y / transformedGridSizeY),
      };
    }

    state.nodes.forEach((n) => {
      if (n.id === id) {
        n.__rg = {
          ...n.__rg,
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
    state.transform = [transform.x, transform.y, transform.k];
  }),

  updateSize: action((state, size) => {
    state.width = size.width;
    state.height = size.height;
  }),

  initD3: action((state, { zoom, selection }) => {
    state.d3Zoom = zoom;
    state.d3Selection = selection;
    state.d3Initialised = true;
  }),

  setConnectionPosition: action((state, position) => {
    state.connectionPosition = position;
  }),

  setConnectionSourceId: action((state, sourceId) => {
    state.connectionSourceId = sourceId;
  }),

  setSnapGrid: action((state, { snapToGrid, snapGrid }) => {
    state.snapToGrid = snapToGrid;
    state.snapGrid = snapGrid;
  }),

  setInteractive: action((state, isInteractive) => {
    state.isInteractive = isInteractive;
  }),
};

const store = createStore(storeModel);

export default store;
