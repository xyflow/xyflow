import { zoomIdentity } from 'd3-zoom';

import { getBoundingBox, getNodesInside } from '../graph-utils';

export const SET_EDGES = 'SET_EDGES';
export const SET_NODES = 'SET_NODES';
export const UPDATE_NODE_DATA = 'UPDATE_NODE_DATA';
export const UPDATE_NODE_POS = 'UPDATE_NODE_POS';
export const UPDATE_TRANSFORM = 'UPDATE_TRANSFORM';
export const UPDATE_SIZE = 'UPDATE_SIZE';
export const INIT_D3 = 'INIT_D3';
export const FIT_VIEW = 'FIT_VIEW';
export const UPDATE_SELECTION = 'UPDATE_SELECTION';
export const SET_SELECTION = 'SET_SELECTION';
export const SET_NODES_SELECTION = 'SET_NODES_SELECTION';
export const SET_SELECTED_NODES_IDS = 'SET_SELECTED_NODES_IDS';
export const REMOVE_NODES = 'REMOVE_NODES';

export const initialState = {
  width: 0,
  height: 0,
  transform: [0, 0, 1],
  nodes: [],
  edges: [],
  selectedNodeIds: [],
  selectedNodesBbox: { x: 0, y: 0, width: 0, height: 0 },

  d3Zoom: null,
  d3Selection: null,
  d3Initialised: false,

  nodesSelectionActive: false,
  selectionActive: false,
  selection: {},
};

export const reducer = (state, action) => {
  switch (action.type) {
    case UPDATE_NODE_DATA: {
      return {
        ...state,
        nodes: state.nodes.map((n) => {
          if (n.data.id === action.payload.id) {
            n.__rg = {
              ...n.__rg,
              ...action.payload.data
            };
          }
          return n;
        })
      };
    }
    case UPDATE_NODE_POS: {
      return {
        ...state,
        nodes: state.nodes.map((n) => {
          if (n.data.id === action.payload.id) {
            n.__rg = {
              ...n.__rg,
              position: action.payload.pos
            };
          }

          return n;
        })
      };
    }
    case FIT_VIEW: {
      const bounds = getBoundingBox(state.nodes);
      const k = Math.min(state.width, state.height) / Math.max(bounds.width, bounds.height);
      const boundsCenterX = bounds.x + (bounds.width / 2);
      const boundsCenterY = bounds.y + (bounds.height / 2);
      const translate = [(state.width / 2) - (boundsCenterX * k), (state.height / 2) - (boundsCenterY * k)];
      const fittedTransform = zoomIdentity.translate(translate[0], translate[1]).scale(k);

      state.d3Selection.call(state.d3Zoom.transform, fittedTransform);

      return state;
    }
    case UPDATE_SELECTION: {
      const selectedNodes = getNodesInside(state.nodes, action.payload.selection, state.transform);
      const selectedNodeIds = selectedNodes.map(n => n.data.id);

      return { ...state, ...action.payload, selectedNodeIds };
    }
    case SET_NODES_SELECTION: {
      if (!action.payload.nodesSelectionActive) {
        return { ...state, nodesSelectionActive: false, selectedNodeIds: [] };
      }
      const selectedNodes = getNodesInside(state.nodes, action.payload.selection, state.transform);
      const selectedNodesBbox = getBoundingBox(selectedNodes);

      return { ...state, ...action.payload, selectedNodesBbox };
    }
    case REMOVE_NODES: {
      const { ids } = action.payload;
      const nextEdges = state.edges.filter(e => !ids.includes(e.data.target) && !ids.includes(e.data.source));
      const nextNodes = state.nodes.filter(n => !ids.includes(n.data.id));

      return { ...state, nodes: nextNodes, edges: nextEdges };
    }
    case SET_NODES:
    case SET_EDGES:
    case UPDATE_TRANSFORM:
    case INIT_D3:
    case UPDATE_SIZE:
    case SET_SELECTION:
    case SET_SELECTED_NODES_IDS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};