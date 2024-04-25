import {
  infiniteExtent,
  ConnectionMode,
  adoptUserNodes,
  getViewportForBounds,
  Transform,
  updateConnectionLookup,
  devWarn,
  getInternalNodesBounds,
} from '@xyflow/system';

import type { Edge, InternalNode, Node, Queue, QueueItem, ReactFlowStore } from '../types';

function createQueue<T>(): Queue<T> {
  let queue: QueueItem<T>[] = [];

  return {
    get: () => queue,
    reset: () => {
      queue = [];
    },
    push: (item) => {
      queue.push(item);
    },
  };
}

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
  const nodeLookup = new Map<string, InternalNode>();
  const parentLookup = new Map();
  const connectionLookup = new Map();
  const edgeLookup = new Map();
  const storeEdges = defaultEdges ?? edges ?? [];
  const storeNodes = defaultNodes ?? nodes ?? [];

  updateConnectionLookup(connectionLookup, edgeLookup, storeEdges);
  adoptUserNodes(storeNodes, nodeLookup, parentLookup, {
    nodeOrigin: [0, 0],
    elevateNodesOnSelect: false,
  });

  let transform: Transform = [0, 0, 1];

  if (fitView && width && height) {
    // @todo users nodeOrigin should be used here
    const bounds = getInternalNodesBounds(nodeLookup, {
      nodeOrigin: [0, 0],
      filter: (node) => !!((node.width || node.initialWidth) && (node.height || node.initialHeight)),
    });
    const { x, y, zoom } = getViewportForBounds(bounds, width, height, 0.5, 2, 0.1);
    transform = [x, y, zoom];
  }

  return {
    rfId: '1',
    width: 0,
    height: 0,
    transform,
    nodes: storeNodes,
    nodeLookup,
    parentLookup,
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

    // A reference of all the batched updates to process before the next render. We
    // want a mutable reference here so multiple synchronous calls to `setNodes` etc
    // can be batched together
    setNodesQueue: createQueue<Node>(),
    setEdgesQueue: createQueue<Edge>(),
    // Because we're using a ref above, we need some way to let React know when to
    // actually process the queue. We flip this bit of state to `true` any time we
    // mutate the queue and then flip it back to `false` after flushing the queue.
    shouldFlushQueue: false,
  };
};

export default getInitialState;
