import { CoordinateExtent, ReactFlowStore, ConnectionMode } from '../types';

const infiniteExtent: CoordinateExtent = [
  [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
  [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
];

const initialState: ReactFlowStore = {
  width: 0,
  height: 0,
  transform: [0, 0, 1],
  nodeInternals: new Map(),
  edges: [],
  onNodesChange: null,
  onEdgesChange: null,
  selectedNodesBbox: { x: 0, y: 0, width: 0, height: 0 },
  d3Zoom: null,
  d3Selection: null,
  d3ZoomHandler: undefined,
  minZoom: 0.5,
  maxZoom: 2,
  translateExtent: infiniteExtent,
  nodeExtent: infiniteExtent,
  nodesSelectionActive: false,
  userSelectionActive: false,
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

  fitViewOnInit: false,
  fitViewOnInitDone: false,
};

export default initialState;
