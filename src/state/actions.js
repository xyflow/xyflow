import {
  SET_NODES, SET_EDGES, UPDATE_NODE_DATA, UPDATE_NODE_POS,
  UPDATE_SELECTION, SET_SELECTION, SET_NODES_SELECTION,
  SET_SELECTED_ELEMENTS, REMOVE_NODES,
} from './index';

export const setNodes = nodes => ({
  type: SET_NODES,
  payload: { nodes }
});

export const setEdges = edges => ({
  type: SET_EDGES,
  payload: { edges }
});

export const updateNodeData = (id, data) => ({
  type: UPDATE_NODE_DATA,
  payload: { id, data }
});

export const updateNodePos = (id, pos) => ({
  type: UPDATE_NODE_POS,
  payload: { id, pos }
});

export const setSelection = isActive => ({
 type: SET_SELECTION,
 payload: { selectionActive: isActive }
});

export const setNodesSelection = ({ isActive, selection }) => ({
  type: SET_NODES_SELECTION,
  payload: { nodesSelectionActive: isActive, selection }
});

export const setSelectedElements = elements => ({
  type: SET_SELECTED_ELEMENTS,
  payload: {
    selectedElements: Array.isArray(elements) ? elements : [elements]
  }
});

export const removeNodes = ids => ({
  type: REMOVE_NODES,
  payload: { ids:  Array.isArray(ids) ? ids : [ids] }
});

export const updateSelection = selection => ({
  type: UPDATE_SELECTION,
  payload: { selection }
});
