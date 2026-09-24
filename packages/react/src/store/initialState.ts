import {
  infiniteExtent,
  ConnectionMode,
  adoptUserNodes,
  getViewportForBounds,
  Transform,
  updateConnectionLookup,
  createDevWarn,
  getInternalNodesBounds,
  NodeOrigin,
  initialConnection,
  CoordinateExtent,
  defaultAriaLabelConfig,
  defaultFitViewPadding,
  ZIndexMode,
  type ConnectionLookup,
  type EdgeLookup,
  type ParentLookup,
} from '@xyflow/system';

const devWarn = createDevWarn('React Flow', 'https://reactflow.dev/');

import type {
  Edge,
  FitViewOptions,
  InternalNode,
  Node,
  ReactFlowStore,
  ViewportStore,
  ConnectionStore,
  NodesStore,
  EdgesStore,
  SelectionStore,
} from '../types';

import { PubSub } from './pubsub';

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
} = {}): {
  optionsStore: ReactFlowStore;
  viewportStore: ViewportStore;
  connectionStore: ConnectionStore;
  nodesStore: NodesStore;
  edgesStore: EdgesStore;
  selectionStore: SelectionStore;
} => {
  const nodeLookup = new Map<string, InternalNode>();
  const parentLookup: ParentLookup<InternalNode> = new Map();
  const connectionLookup: ConnectionLookup = new Map();
  const edgeLookup: EdgeLookup<Edge> = new Map();

  const storeEdges = defaultEdges ?? edges ?? [];
  const storeNodes = defaultNodes ?? nodes ?? [];
  const storeNodeOrigin = nodeOrigin ?? [0, 0];
  const storeNodeExtent = nodeExtent ?? infiniteExtent;

  updateConnectionLookup(connectionLookup, edgeLookup, storeEdges);
  const { nodesInitialized } = adoptUserNodes(storeNodes, nodeLookup, parentLookup, {
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
      fitViewOptions?.padding ?? defaultFitViewPadding
    );
    transform = [x, y, zoom];
  }

  return {
    optionsStore: {
      rfId: '1',
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
      connectionMode: ConnectionMode.Strict,
      domNode: null,
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
      debug: false,
      ariaLabelConfig: defaultAriaLabelConfig,
      zIndexMode,
      onNodesChangeMiddlewareMap: new Map(),
      onEdgesChangeMiddlewareMap: new Map(),
      pubSub: new PubSub(),
    },
    viewportStore: {
      paneDragging: false,
      width: width ?? 0,
      height: height ?? 0,
      transform,
    },
    connectionStore: {
      connection: { ...initialConnection },
      connectionClickStartHandle: null,
    },
    nodesStore: {
      nodes: storeNodes,
      nodesInitialized,
      nodeLookup,
      parentLookup,
    },
    edgesStore: {
      edges: storeEdges,
      edgeLookup,
      connectionLookup,
    },
    selectionStore: {
      userSelectionRect: null,
    },
  };
};

export default getInitialState;
