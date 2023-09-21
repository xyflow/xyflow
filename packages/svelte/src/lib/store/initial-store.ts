import { readable, writable } from 'svelte/store';
import {
  infiniteExtent,
  SelectionMode,
  ConnectionMode,
  ConnectionLineType,
  type SelectionRect,
  type Transform,
  type SnapGrid,
  type MarkerProps,
  type PanZoomInstance,
  type CoordinateExtent,
  type IsValidConnection,
  type GroupedEdges,
  type NodeOrigin,
  type OnError,
  devWarn
} from '@xyflow/system';

import DefaultNode from '$lib/components/nodes/DefaultNode.svelte';
import InputNode from '$lib/components/nodes/InputNode.svelte';
import OutputNode from '$lib/components/nodes/OutputNode.svelte';
import BezierEdge from '$lib/components/edges/BezierEdge.svelte';
import StraightEdge from '$lib/components/edges/StraightEdge.svelte';
import SmoothStepEdge from '$lib/components/edges/SmoothStepEdge.svelte';
import StepEdge from '$lib/components/edges/StepEdge.svelte';
import type { ConnectionData, NodeTypes, EdgeTypes, EdgeLayouted, Node } from '$lib/types';
import { createNodesStore, createEdgesStore } from './utils';

export const initConnectionData = {
  connectionStartHandle: null,
  connectionEndHandle: null,
  connectionPosition: null,
  connectionStatus: null
};

export const initialNodeTypes = {
  input: InputNode,
  output: OutputNode,
  default: DefaultNode
};

export const initialEdgeTypes = {
  straight: StraightEdge,
  smoothstep: SmoothStepEdge,
  default: BezierEdge,
  step: StepEdge
};

export const getInitialStore = () => ({
  flowId: writable<string | null>(null),
  nodes: createNodesStore([]),
  visibleNodes: readable<Node[]>([]),
  edges: createEdgesStore([]),
  edgeTree: readable<GroupedEdges<EdgeLayouted>[]>([]),
  height: writable<number>(500),
  width: writable<number>(500),
  minZoom: writable<number>(0.5),
  maxZoom: writable<number>(2),
  nodeOrigin: writable<NodeOrigin>([0, 0]),
  nodeExtent: writable<CoordinateExtent>(infiniteExtent),
  translateExtent: writable<CoordinateExtent>(infiniteExtent),
  autoPanOnNodeDrag: writable<boolean>(true),
  autoPanOnConnect: writable<boolean>(true),
  fitViewOnInit: writable<boolean>(false),
  fitViewOnInitDone: writable<boolean>(false),
  panZoom: writable<PanZoomInstance | null>(null),
  snapGrid: writable<SnapGrid | null>(null),
  dragging: writable<boolean>(false),
  selectionRect: writable<SelectionRect | null>(null),
  selectionKeyPressed: writable<boolean>(false),
  multiselectionKeyPressed: writable<boolean>(false),
  deleteKeyPressed: writable<boolean>(false),
  panActivationKeyPressed: writable<boolean>(false),
  selectionRectMode: writable<string | null>(null),
  selectionMode: writable<SelectionMode>(SelectionMode.Partial),
  nodeTypes: writable<NodeTypes>(initialNodeTypes),
  edgeTypes: writable<EdgeTypes>(initialEdgeTypes),
  transform: writable<Transform>([0, 0, 1]),
  connectionMode: writable<ConnectionMode>(ConnectionMode.Strict),
  domNode: writable<HTMLDivElement | null>(null),
  connectionPath: readable<string | null>(null),
  connection: writable<ConnectionData>(initConnectionData),
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
  onError: writable<OnError>(devWarn)
});
