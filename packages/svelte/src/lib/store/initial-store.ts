import { readable, writable } from 'svelte/store';
import {
  infiniteExtent,
  SelectionMode,
  ConnectionMode,
  ConnectionLineType,
  devWarn,
  adoptUserNodes,
  getViewportForBounds,
  updateConnectionLookup,
  initialConnection,
  type SelectionRect,
  type SnapGrid,
  type MarkerProps,
  type PanZoomInstance,
  type CoordinateExtent,
  type NodeOrigin,
  type OnError,
  type Viewport,
  type ConnectionLookup,
  type OnConnect,
  type OnConnectStart,
  type OnConnectEnd,
  type NodeLookup,
  type EdgeLookup,
  type ConnectionState,
  type ParentLookup,
  getInternalNodesBounds
} from '@xyflow/system';

import DefaultNode from '$lib/components/nodes/DefaultNode.svelte';
import InputNode from '$lib/components/nodes/InputNode.svelte';
import OutputNode from '$lib/components/nodes/OutputNode.svelte';
import GroupNode from '$lib/components/nodes/GroupNode.svelte';

import {
  BezierEdgeInternal,
  SmoothStepEdgeInternal,
  StraightEdgeInternal,
  StepEdgeInternal
} from '$lib/components/edges';

import type {
  NodeTypes,
  EdgeTypes,
  EdgeLayouted,
  Node,
  Edge,
  FitViewOptions,
  OnDelete,
  OnEdgeCreate,
  OnBeforeDelete,
  IsValidConnection,
  InternalNode
} from '$lib/types';
import { createNodesStore, createEdgesStore } from './utils';

export const initialNodeTypes = {
  input: InputNode,
  output: OutputNode,
  default: DefaultNode,
  group: GroupNode
};

export const initialEdgeTypes = {
  straight: StraightEdgeInternal,
  smoothstep: SmoothStepEdgeInternal,
  default: BezierEdgeInternal,
  step: StepEdgeInternal
};

export const getInitialStore = ({
  nodes = [],
  edges = [],
  width,
  height,
  fitView,
  nodeOrigin,
  nodeExtent
}: {
  nodes?: Node[];
  edges?: Edge[];
  width?: number;
  height?: number;
  fitView?: boolean;
  nodeOrigin?: NodeOrigin;
  nodeExtent?: CoordinateExtent;
}) => {
  const nodeLookup: NodeLookup = new Map();
  const parentLookup = new Map();
  const connectionLookup = new Map();
  const edgeLookup = new Map();

  const storeNodeOrigin = nodeOrigin ?? [0, 0];
  const storeNodeExtent = nodeExtent ?? infiniteExtent;

  adoptUserNodes(nodes, nodeLookup, parentLookup, {
    nodeExtent: storeNodeExtent,
    nodeOrigin: storeNodeOrigin,
    elevateNodesOnSelect: false,
    checkEquality: false
  });

  updateConnectionLookup(connectionLookup, edgeLookup, edges);

  let viewport: Viewport = { x: 0, y: 0, zoom: 1 };

  if (fitView && width && height) {
    const bounds = getInternalNodesBounds(nodeLookup, {
      filter: (node) => !!((node.width || node.initialWidth) && (node.height || node.initialHeight))
    });
    viewport = getViewportForBounds(bounds, width, height, 0.5, 2, 0.1);
  }

  return {
    flowId: writable<string | null>(null),
    nodes: createNodesStore(nodes, nodeLookup, parentLookup, storeNodeOrigin),
    nodeLookup: readable<NodeLookup<InternalNode>>(nodeLookup),
    parentLookup: readable<ParentLookup<InternalNode>>(parentLookup),
    edgeLookup: readable<EdgeLookup<Edge>>(edgeLookup),
    visibleNodes: readable<InternalNode[]>([]),
    edges: createEdgesStore(edges, connectionLookup, edgeLookup),
    visibleEdges: readable<EdgeLayouted[]>([]),
    connectionLookup: readable<ConnectionLookup>(connectionLookup),
    height: writable<number>(500),
    width: writable<number>(500),
    minZoom: writable<number>(0.5),
    maxZoom: writable<number>(2),
    nodeOrigin: writable<NodeOrigin>(storeNodeOrigin),
    nodeDragThreshold: writable<number>(1),
    nodeExtent: writable<CoordinateExtent>(storeNodeExtent),
    translateExtent: writable<CoordinateExtent>(infiniteExtent),
    autoPanOnNodeDrag: writable<boolean>(true),
    autoPanOnConnect: writable<boolean>(true),
    fitViewOnInit: writable<boolean>(false),
    fitViewOnInitDone: writable<boolean>(false),
    fitViewOptions: writable<FitViewOptions>(undefined),
    panZoom: writable<PanZoomInstance | null>(null),
    snapGrid: writable<SnapGrid | null>(null),
    dragging: writable<boolean>(false),
    selectionRect: writable<SelectionRect | null>(null),
    selectionKeyPressed: writable<boolean>(false),
    multiselectionKeyPressed: writable<boolean>(false),
    deleteKeyPressed: writable<boolean>(false),
    panActivationKeyPressed: writable<boolean>(false),
    zoomActivationKeyPressed: writable<boolean>(false),
    selectionRectMode: writable<string | null>(null),
    selectionMode: writable<SelectionMode>(SelectionMode.Partial),
    nodeTypes: writable<NodeTypes>(initialNodeTypes),
    edgeTypes: writable<EdgeTypes>(initialEdgeTypes),
    viewport: writable<Viewport>(viewport),
    connectionMode: writable<ConnectionMode>(ConnectionMode.Strict),
    domNode: writable<HTMLDivElement | null>(null),
    connection: readable<ConnectionState>(initialConnection),
    connectionLineType: writable<ConnectionLineType>(ConnectionLineType.Bezier),
    connectionRadius: writable<number>(20),
    isValidConnection: writable<IsValidConnection>(() => true),
    nodesDraggable: writable<boolean>(true),
    nodesConnectable: writable<boolean>(true),
    elementsSelectable: writable<boolean>(true),
    selectNodesOnDrag: writable<boolean>(true),
    markers: readable<MarkerProps[]>([]),
    defaultMarkerColor: writable<string>('#b1b1b7'),
    lib: readable<string>('svelte'),
    onlyRenderVisibleElements: writable<boolean>(false),
    onerror: writable<OnError>(devWarn),
    ondelete: writable<OnDelete>(undefined),
    onedgecreate: writable<OnEdgeCreate>(undefined),
    onconnect: writable<OnConnect>(undefined),
    onconnectstart: writable<OnConnectStart>(undefined),
    onconnectend: writable<OnConnectEnd>(undefined),
    onbeforedelete: writable<OnBeforeDelete>(undefined),
    nodesInitialized: writable<boolean>(false),
    edgesInitialized: writable<boolean>(false),
    viewportInitialized: writable<boolean>(false),
    initialized: readable<boolean>(false)
  };
};
