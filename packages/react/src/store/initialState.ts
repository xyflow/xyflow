import {
  infiniteExtent,
  ConnectionMode,
  adoptUserProvidedNodes,
  getNodesBounds,
  getViewportForBounds,
  Transform,
  updateConnectionLookup,
  devWarn,
} from '@xyflow/system';

import type { Edge, Node, ReactFlowStore } from '../types';

const getInitialState = ({
  nodes,
  edges,
  defaultNodes,
  defaultEdges,
  width,
  height,
  fitView,
}: {
  nodes?: Node[];
  edges?: Edge[];
  defaultNodes?: Node[];
  defaultEdges?: Edge[];
  width?: number;
  height?: number;
  fitView?: boolean;
} = {}): ReactFlowStore => {
  const nodeLookup = new Map();
  const connectionLookup = new Map();
  const edgeLookup = new Map();
  const storeEdges = defaultEdges ?? edges ?? [];
  const storeNodes = defaultNodes ?? nodes ?? [];

  updateConnectionLookup(connectionLookup, edgeLookup, storeEdges);
  const nextNodes = adoptUserProvidedNodes(storeNodes, nodeLookup, {
    nodeOrigin: [0, 0],
    elevateNodesOnSelect: false,
  });

  let transform: Transform = [0, 0, 1];

  if (fitView && width && height) {
    const nodesWithDimensions = nextNodes.filter(
      (node) => (node.width || node.initialWidth) && (node.height || node.initialHeight)
    );
    // @todo users nodeOrigin should be used here
    const bounds = getNodesBounds(nodesWithDimensions, { nodeOrigin: [0, 0] });
    const { x, y, zoom } = getViewportForBounds(bounds, width, height, 0.5, 2, 0.1);
    transform = [x, y, zoom];
  }

  return {
    rfId: '1',
    width: 0,
    height: 0,
    transform,
    nodes: nextNodes,
    nodeLookup,
    edges: storeEdges,
    edgeLookup,
    connectionLookup,
    onNodesChange: null,
    onEdgesChange: null,
    hasDefaultNodes: defaultNodes !== undefined,
    hasDefaultEdges: defaultEdges !== undefined,
    panZoom: null,
    minZoom: 0.5,
    maxZoom: 2,
    translateExtent: infiniteExtent,
    nodeExtent: infiniteExtent,
    nodesSelectionActive: false,
    userSelectionActive: false,
    userSelectionRect: null,
    connectionPosition: { x: 0, y: 0 },
    connectionStatus: null,
    connectionMode: ConnectionMode.Strict,
    domNode: null,
    paneDragging: false,
    noPanClassName: 'nopan',
    nodeOrigin: [0, 0],
    nodeDragThreshold: 1,

    snapGrid: [15, 15],
    snapToGrid: false,

    nodesDraggable: true,
    nodesConnectable: true,
    nodesFocusable: true,
    edgesFocusable: true,
    edgesUpdatable: true,
    elementsSelectable: true,
    elevateNodesOnSelect: true,
    elevateEdgesOnSelect: false,
    fitViewOnInit: false,
    fitViewDone: false,
    fitViewOnInitOptions: undefined,
    selectNodesOnDrag: true,

    multiSelectionActive: false,

    connectionStartHandle: null,
    connectionEndHandle: null,
    connectionClickStartHandle: null,
    connectOnClick: true,

    ariaLiveMessage: '',
    autoPanOnConnect: true,
    autoPanOnNodeDrag: true,
    connectionRadius: 20,
    onError: devWarn,
    isValidConnection: undefined,
    onSelectionChangeHandlers: [],

    lib: 'react',
    debug: false,
  };
};

export default getInitialState;
