import {
  UPDATE_TRANSFORM, UPDATE_SIZE, SET_NODES, SET_EDGES,
  UPDATE_NODE_DATA, UPDATE_NODE_POS, INIT_D3, FIT_VIEW,
  UPDATE_SELECTION, SET_SELECTION, SET_NODES_SELECTION,
  SET_SELECTED_ELEMENTS, REMOVE_NODES
} from './index';

export const updateTransform = (transform) => {
  return {
    type: UPDATE_TRANSFORM,
    payload: { transform: [transform.x, transform.y, transform.k] }
  };
};

export const updateSize = (size) => {
  return {
    type: UPDATE_SIZE,
    payload: size
  };
};

export const setNodes = (nodes) => {
  return {
    type: SET_NODES,
    payload: { nodes }
  };
};

export const setEdges = (edges) => {
  return {
    type: SET_EDGES,
    payload: { edges }
  };
};

export const updateNodeData = (id, data) => {
  return {
    type: UPDATE_NODE_DATA,
    payload: { id, data }
  };
};

export const updateNodePos = (id, pos) => {
  return {
    type: UPDATE_NODE_POS,
    payload: { id, pos }
  };
};

export const initD3 = ({ zoom, selection }) => {
  return {
    type: INIT_D3,
    payload: { d3Zoom: zoom, d3Selection: selection, d3Initialised: true }
  };
};

export const fitView = () => {
  return { type: FIT_VIEW };
};

export const setSelection = (isActive) => {
  return { type: SET_SELECTION, payload: { selectionActive: isActive } };
};

export const setNodesSelection = ({ isActive, selection }) => {
  return { type: SET_NODES_SELECTION, payload: { nodesSelectionActive: isActive, selection } };
};

export const setSelectedElements = (elements) => {
  const elementsArray = Array.isArray(elements) ? elements : [elements];

  return {
    type: SET_SELECTED_ELEMENTS,
    payload: {
      selectedElements: elementsArray,
      nodesSelectionActive: false
    }
  };
};

export const removeNodes = (ids) => {
  const idArray = Array.isArray(ids) ? ids : [ids];

  return { type: REMOVE_NODES, payload: { ids: idArray } };
}

export const updateSelection = (selection) => {
  return {
    type: UPDATE_SELECTION,
    payload: {
      selection
    }
  };
};
