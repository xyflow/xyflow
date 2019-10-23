import { createStore, Action, action } from 'easy-peasy';
import isEqual from 'fast-deep-equal';
import { Selection as D3Selection, ZoomBehavior } from 'd3';

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
  HandleElement,
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

type NodeUpdate = {
  id: ElementId;
  width: number;
  height: number;
  handleBounds: {
    source: HandleElement[] | null;
    target: HandleElement[] | null;
  };
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
  selectedElements: Elements;
  selectedNodesBbox: Rect;

  d3Zoom: ZoomBehavior<Element, unknown> | null;
  d3Selection: D3Selection<Element, unknown, null, undefined> | null;
  d3Initialised: boolean;

  nodesSelectionActive: boolean;
  selectionActive: boolean;
  selection: SelectionRect | null;

  connectionSourceId: ElementId | null;
  connectionPosition: XYPosition;

  snapToGrid: boolean;
  snapGrid: [number, number];

  isInteractive: boolean;

  onConnect: OnConnectFunc;

  setOnConnect: Action<StoreModel, OnConnectFunc>;

  setNodes: Action<StoreModel, Node[]>;

  setEdges: Action<StoreModel, Edge[]>;

  updateNodeData: Action<StoreModel, NodeUpdate>;

  updateNodePos: Action<StoreModel, NodePosUpdate>;

  setSelection: Action<StoreModel, boolean>;

  setNodesSelection: Action<StoreModel, SelectionUpdate>;

  setSelectedElements: Action<StoreModel, Elements | Node | Edge>;

  updateSelection: Action<StoreModel, SelectionRect>;

  updateTransform: Action<StoreModel, TransformXYK>;

  updateSize: Action<StoreModel, Dimensions>;

  initD3: Action<StoreModel, D3Init>;

  setSnapGrid: Action<StoreModel, SetSnapGrid>;

  setConnectionPosition: Action<StoreModel, XYPosition>;

  setConnectionSourceId: Action<StoreModel, ElementId | null>;

  setInteractive: Action<StoreModel, boolean>;
}

const storeModel: StoreModel = {
  width: 0,
  height: 0,
  transform: [0, 0, 1],
  nodes: [],
  edges: [],
  selectedElements: [],
  selectedNodesBbox: { x: 0, y: 0, width: 0, height: 0 },

  d3Zoom: null,
  d3Selection: null,
  d3Initialised: false,

  nodesSelectionActive: false,
  selectionActive: false,
  selection: null,

  connectionSourceId: null,
  connectionPosition: { x: 0, y: 0 },

  snapGrid: [16, 16],
  snapToGrid: true,

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

  updateNodeData: action((state, { id, ...data }) => {
    state.nodes.forEach(n => {
      if (n.id === id) {
        n.__rg = {
          ...n.__rg,
          ...data,
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

    state.nodes.forEach(n => {
      if (n.id === id) {
        n.__rg = {
          ...n.__rg,
          position,
        };
      }
    });
  }),

  setSelection: action((state, isActive) => {
    state.selectionActive = isActive;
  }),

  setNodesSelection: action((state, { isActive, selection }) => {
    if (!isActive || typeof selection === 'undefined') {
      state.nodesSelectionActive = false;
      state.selectedElements = [];

      return;
    }
    const selectedNodes = getNodesInside(state.nodes, selection, state.transform);

    if (!selectedNodes.length) {
      state.nodesSelectionActive = false;
      state.selectedElements = [];

      return;
    }

    const selectedNodesBbox = getRectOfNodes(selectedNodes);

    state.selection = selection;
    state.nodesSelectionActive = true;
    state.selectedNodesBbox = selectedNodesBbox;
    state.nodesSelectionActive = true;
  }),

  setSelectedElements: action((state, elements) => {
    const selectedElementsArr = Array.isArray(elements) ? elements : [elements];
    const selectedElementsUpdated = !isEqual(selectedElementsArr, state.selectedElements);
    const selectedElements = selectedElementsUpdated ? selectedElementsArr : state.selectedElements;

    state.selectedElements = selectedElements;
  }),

  updateSelection: action((state, selection) => {
    const selectedNodes = getNodesInside(state.nodes, selection, state.transform);
    const selectedEdges = getConnectedEdges(selectedNodes, state.edges);

    const nextSelectedElements = [...selectedNodes, ...selectedEdges];
    const selectedElementsUpdated = !isEqual(nextSelectedElements, state.selectedElements);

    state.selection = selection;
    state.selectedElements = selectedElementsUpdated ? nextSelectedElements : state.selectedElements;
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
