import { action } from 'easy-peasy';
import isEqual from 'fast-deep-equal';

import { getBoundingBox, getNodesInside, getConnectedEdges } from '../utils/graph';

export default {
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