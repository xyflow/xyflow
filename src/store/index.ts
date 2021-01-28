import configureStore from './configure-store';

import { ReactFlowState, ConnectionMode } from '../types';

export const initialState: ReactFlowState = {
  width: 0,
  height: 0,
  transform: [0, 0, 1],
  elements: [],
  // nodes: computed((state) => state.elements.filter(isNode)),
  // edges: computed((state) => state.elements.filter(isEdge)),
  selectedElements: null,
  selectedNodesBbox: { x: 0, y: 0, width: 0, height: 0 },
  // viewportBox: computed((state) => ({ x: 0, y: 0, width: state.width, height: state.height })),

  d3Zoom: null,
  d3Selection: null,
  d3ZoomHandler: undefined,
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
  connectionHandleId: null,
  connectionHandleType: 'source',
  connectionPosition: { x: 0, y: 0 },
  connectionMode: ConnectionMode.Strict,

  snapGrid: [15, 15],
  snapToGrid: false,

  nodesDraggable: true,
  nodesConnectable: true,
  elementsSelectable: true,

  multiSelectionActive: false,

  reactFlowVersion: typeof __REACT_FLOW_VERSION__ !== 'undefined' ? __REACT_FLOW_VERSION__ : '-',
};

const store = configureStore(initialState);

export type ReactFlowDispatch = typeof store.dispatch;

export default store;
