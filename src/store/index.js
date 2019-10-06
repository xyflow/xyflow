import { createStore } from 'easy-peasy';

import actions from './actions';

const store = createStore({
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

  ...actions
});

export default store;
