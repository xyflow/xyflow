import { readable, writable } from 'svelte/store';
import {
  SelectionMode,
  type D3ZoomInstance,
  type D3SelectionInstance,
  ConnectionMode,
  ConnectionLineType,
  type SelectionRect,
  type Transform,
  type NodeOrigin
} from '@reactflow/system';

import DefaultNode from '$lib/components/nodes/DefaultNode.svelte';
import InputNode from '$lib/components/nodes/InputNode.svelte';
import OutputNode from '$lib/components/nodes/OutputNode.svelte';
import BezierEdge from '$lib/components/edges/BezierEdge.svelte';
import StraightEdge from '$lib/components/edges/StraightEdge.svelte';
import SmoothStepEdge from '$lib/components/edges/SmoothStepEdge.svelte';
import type { ConnectionData, NodeTypes, EdgeTypes, EdgeLayouted, Edge, Node } from '$lib/types';

export const initConnectionData = {
  nodeId: null,
  handleId: null,
  handleType: null,
  position: null,
  status: null
};

export const initialNodeTypes = {
  input: InputNode,
  output: OutputNode,
  default: DefaultNode
};

export const initialEdgeTypes = {
  straight: StraightEdge,
  smoothstep: SmoothStepEdge,
  default: BezierEdge
};

export const initialStoreState = {
  id: writable<string | null>(null),
  nodes: writable<Node[]>([]),
  edges: writable<Edge[]>([]),
  edgesLayouted: readable<EdgeLayouted[]>([]),
  height: writable<number>(500),
  width: writable<number>(500),
  minZoom: writable<number>(0.5),
  maxZoom: writable<number>(2),
  fitViewOnInit: writable<boolean>(false),
  fitViewOnInitDone: writable<boolean>(false),
  nodeOrigin: writable<NodeOrigin>([0, 0]),
  d3: writable<{ zoom: D3ZoomInstance | null; selection: D3SelectionInstance | null }>({
    zoom: null,
    selection: null
  }),
  dragging: writable<boolean>(false),
  selectionRect: writable<SelectionRect | null>(null),
  selectionKeyPressed: writable<boolean>(false),
  multiselectionKeyPressed: writable<boolean>(false),
  deleteKeyPressed: writable<boolean>(false),
  selectionRectMode: writable<string | null>(null),
  selectionMode: writable<SelectionMode>(SelectionMode.Partial),
  nodeTypes: writable<NodeTypes>(initialNodeTypes),
  edgeTypes: writable<EdgeTypes>(initialEdgeTypes),
  transform: writable<Transform>([0, 0, 1]),
  connectionMode: writable<ConnectionMode>(ConnectionMode.Strict),
  domNode: writable<HTMLDivElement | null>(null),
  connectionPath: readable<string | null>(null),
  connection: writable<ConnectionData>(initConnectionData),
  connectionRadius: writable<number>(25),
  connectionLineType: writable<ConnectionLineType>(ConnectionLineType.Bezier)
};
