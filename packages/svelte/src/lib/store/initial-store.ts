import { readable, writable } from 'svelte/store';
import {
  infiniteExtent,
  SelectionMode,
  ConnectionMode,
  ConnectionLineType,
  type SelectionRect,
  type SnapGrid,
  type MarkerProps,
  type PanZoomInstance,
  type CoordinateExtent,
  type IsValidConnection,
  type GroupedEdges,
  type NodeOrigin,
  type OnError,
  devWarn,
  type Viewport,
  updateNodes,
  getNodesBounds,
  getViewportForBounds,
  updateConnectionLookup,
  type ConnectionLookup,
  type OnConnect,
  type OnConnectStart,
  type OnConnectEnd
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
  OnEdgeCreate
} from '$lib/types';
import { createNodesStore, createEdgesStore } from './utils';
import { initConnectionProps, type ConnectionProps } from './derived-connection-props';

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
  fitView
}: {
  nodes?: Node[];
  edges?: Edge[];
  width?: number;
  height?: number;
  fitView?: boolean;
}) => {
  const nodeLookup = new Map();
  const nextNodes = updateNodes(nodes, nodeLookup, {
    nodeOrigin: [0, 0],
    elevateNodesOnSelect: false
  });
  const connectionLookup = updateConnectionLookup(new Map(), edges);

  let viewport: Viewport = { x: 0, y: 0, zoom: 1 };

  if (fitView && width && height) {
    const nodesWithDimensions = nextNodes.filter((node) => node.width && node.height);
    const bounds = getNodesBounds(nodesWithDimensions, [0, 0]);
    viewport = getViewportForBounds(bounds, width, height, 0.5, 2, 0.1);
  }

  return {
    flowId: writable<string | null>(null),
    nodes: createNodesStore(nextNodes, nodeLookup),
    nodeLookup: readable<Map<string, Node>>(nodeLookup),
    visibleNodes: readable<Node[]>([]),
    edges: createEdgesStore(edges, connectionLookup),
    edgeTree: readable<GroupedEdges<EdgeLayouted>[]>([]),
    connectionLookup: readable<ConnectionLookup>(connectionLookup),
    height: writable<number>(500),
    width: writable<number>(500),
    minZoom: writable<number>(0.5),
    maxZoom: writable<number>(2),
    nodeOrigin: writable<NodeOrigin>([0, 0]),
    nodeDragThreshold: writable<number>(0),
    nodeExtent: writable<CoordinateExtent>(infiniteExtent),
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
    connection: readable<ConnectionProps>(initConnectionProps),
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
    onconnectend: writable<OnConnectEnd>(undefined)
  };
};
