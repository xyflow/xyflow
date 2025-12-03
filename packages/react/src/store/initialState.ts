import {
  infiniteExtent,
  ConnectionMode,
  adoptUserNodes,
  getViewportForBounds,
  Transform,
  updateConnectionLookup,
  devWarn,
  getInternalNodesBounds,
  NodeOrigin,
  initialConnection,
  CoordinateExtent,
  defaultAriaLabelConfig,
  ZIndexMode,
} from '@xyflow/system';

import type { Edge, FitViewOptions, InternalNode, Node, ReactFlowStore } from '../types';

const getInitialState = ({
  nodes,
  edges,
  defaultNodes,
  defaultEdges,
  width,
  height,
  fitView,
  fitViewOptions,
  minZoom = 0.5,
  maxZoom = 2,
  nodeOrigin,
  nodeExtent,
  zIndexMode = 'basic',
}: {
  nodes?: Node[];
  edges?: Edge[];
  defaultNodes?: Node[];
  defaultEdges?: Edge[];
  width?: number;
  height?: number;
  fitView?: boolean;
  fitViewOptions?: FitViewOptions;
  minZoom?: number;
  maxZoom?: number;
  nodeOrigin?: NodeOrigin;
  nodeExtent?: CoordinateExtent;
  zIndexMode?: ZIndexMode;
} = {}): ReactFlowStore => {
  const nodeLookup = new Map<string, InternalNode>();
  const parentLookup = new Map();
  const connectionLookup = new Map();
  const edgeLookup = new Map();

  const storeEdges = defaultEdges ?? edges ?? [];
  const storeNodes = defaultNodes ?? nodes ?? [];
  const storeNodeOrigin = nodeOrigin ?? [0, 0];
  const storeNodeExtent = nodeExtent ?? infiniteExtent;

  updateConnectionLookup(connectionLookup, edgeLookup, storeEdges);
  const nodesInitialized = adoptUserNodes(storeNodes, nodeLookup, parentLookup, {
    nodeOrigin: storeNodeOrigin,
    nodeExtent: storeNodeExtent,
    zIndexMode,
  });

  let transform: Transform = [0, 0, 1];

  if (fitView && width && height) {
    const bounds = getInternalNodesBounds(nodeLookup, {
      filter: (node) => !!((node.width || node.initialWidth) && (node.height || node.initialHeight)),
    });

    const { x, y, zoom } = getViewportForBounds(
      bounds,
      width,
      height,
      minZoom,
      maxZoom,
      fitViewOptions?.padding ?? 0.1
    );
    transform = [x, y, zoom];
  }

  return {
    rfId: '1',
    width: width ?? 0,
    height: height ?? 0,
    transform,
    nodes: storeNodes,
    nodesInitialized,
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
    minZoom,
    maxZoom,
    translateExtent: infiniteExtent,
    nodeExtent: storeNodeExtent,
    nodesSelectionActive: false,
    userSelectionActive: false,
    userSelectionRect: null,
    connectionMode: ConnectionMode.Strict,
    domNode: null,
    paneDragging: false,
    noPanClassName: 'nopan',
    nodeOrigin: storeNodeOrigin,
    nodeDragThreshold: 1,
    connectionDragThreshold: 1,

    snapGrid: [15, 15],
    snapToGrid: false,

    nodesDraggable: true,
    nodesConnectable: true,
    nodesFocusable: true,
    edgesFocusable: true,
    edgesReconnectable: true,
    elementsSelectable: true,
    elevateNodesOnSelect: true,
    elevateEdgesOnSelect: true,
    selectNodesOnDrag: true,

    multiSelectionActive: false,

    fitViewQueued: fitView ?? false,
    fitViewOptions,
    fitViewResolver: null,

    connection: { ...initialConnection },
    connectionClickStartHandle: null,
    connectOnClick: true,

    ariaLiveMessage: '',
    autoPanOnConnect: true,
    autoPanOnNodeDrag: true,
    autoPanOnNodeFocus: true,
    autoPanSpeed: 15,

    connectionRadius: 20,
    onError: devWarn,
    isValidConnection: undefined,
    onSelectionChangeHandlers: [],

    lib: 'react',
    debug: false,
    ariaLabelConfig: defaultAriaLabelConfig,
    zIndexMode,

    onNodesChangeMiddlewareMap: new Map(),
    onEdgesChangeMiddlewareMap: new Map(),
  };
};

export default getInitialState;
