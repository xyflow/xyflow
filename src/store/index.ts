import { createStore, Action, action } from 'easy-peasy';
import isEqual from 'fast-deep-equal';

import { getBoundingBox, getNodesInside, getConnectedEdges } from '../utils/graph';
import {
  ElementId, Elements, Transform, Node,
  Edge, Rect, Dimensions, XYPosition
} from '../types';

type TransformXYK = {
  x: number,
  y: number,
  k: number
};

type NodeUpdate = {
  id: ElementId,
  pos: XYPosition
};

type SelectionUpdate = {
  isActive: boolean,
  selection?: any;
};

type D3Init = {
  zoom: any,
  selection: any
};

export interface StoreModel {
  width: number;
  height: number;
  transform: Transform;
  nodes: Node[];
  edges: Edge[];
  selectedElements: any[];
  selectedNodesBbox: Rect;

  d3Zoom: any;
  d3Selection: any;
  d3Initialised: boolean;

  nodesSelectionActive: boolean;
  selectionActive: boolean;
  selection: any;

  connectionSourceId: ElementId | null;
  connectionPosition: XYPosition;

  onConnect: (any) => void;

  setOnConnect: Action<StoreModel, any>;

  setNodes: Action<StoreModel, Node[]>;

  setEdges: Action<StoreModel, Edge[]>;

  updateNodeData:  Action<StoreModel, any>;

  updateNodePos: Action<StoreModel, NodeUpdate>;

  setSelection: Action<StoreModel, boolean>;

  setNodesSelection: Action<StoreModel, SelectionUpdate>;

  setSelectedElements: Action<StoreModel, Elements|Node|Edge>

  updateSelection: Action<StoreModel, Rect>;

  updateTransform: Action<StoreModel, TransformXYK>;

  updateSize: Action<StoreModel, Dimensions>;

  initD3: Action<StoreModel, D3Init>;

  setConnectionPosition: Action<StoreModel, XYPosition>;

  setConnectionSourceId: Action<StoreModel, ElementId>;
};

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
  selection: {},

  connectionSourceId: null,
  connectionPosition: { x: 0, y: 0 },

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
    state.nodes.forEach((n) => {
      if (n.id === id) {
        n.__rg = {
          ...n.__rg,
          ...data
        };
      }
    });
  }),

  updateNodePos: action((state, { id, pos }) => {
    state.nodes.forEach((n) => {
      if (n.id === id) {
        n.__rg = {
          ...n.__rg,
          position: pos
        };
      }
    });
  }),

  setSelection: action((state, isActive) => {
    state.selectionActive = isActive;
  }),

  setNodesSelection: action((state, { isActive, selection }) => {
    if (!isActive) {
      state.nodesSelectionActive = false;
      state.selectedElements = [];

      return;
    }
    const selectedNodes = getNodesInside(state.nodes, selection, state.transform);
    const selectedNodesBbox = getBoundingBox(selectedNodes);

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

    const nextSelectedElements =  [...selectedNodes, ...selectedEdges];
    const selectedElementsUpdated = !isEqual(nextSelectedElements, state.selectedElements);

    state.selection = selection;
    state.selectedElements = selectedElementsUpdated ? nextSelectedElements: state.selectedElements
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
  })
};

const store = createStore(storeModel);

export default store;
