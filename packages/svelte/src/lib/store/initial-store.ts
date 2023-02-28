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
import type { Node, Edge, ConnectionData, NodeTypes, EdgeTypes, EdgeLayouted } from '$lib/types';
import BezierEdge from '$lib/components/edges/BezierEdge.svelte';
import StraightEdge from '$lib/components/edges/StraightEdge.svelte';
import SmoothStepEdge from '$lib/components/edges/SmoothStepEdge.svelte';

export const initConnectionData = {
  nodeId: null,
  handleId: null,
  handleType: null,
  position: null,
  status: null
};

export const initialStoreState = {
  nodes: writable<Node[]>([]),
  edges: writable<Edge[]>([]),
  edgesLayouted: readable<EdgeLayouted[]>([]),
  height: writable<number>(500),
  width: writable<number>(500),
  nodeOrigin: writable<NodeOrigin>([0.5, 0.5]),
  d3: writable<{ zoom: D3ZoomInstance | null; selection: D3SelectionInstance | null }>({
    zoom: null,
    selection: null
  }),
  id: writable<string | null>(null),
  dragging: writable<boolean>(false),
  selectionRect: writable<SelectionRect | null>(null),
  selectionKeyPressed: writable<boolean>(false),
  multiselectionKeyPressed: writable<boolean>(false),
  deleteKeyPressed: writable<boolean>(false),
  selectionRectMode: writable<string | null>(null),
  selectionMode: writable<SelectionMode>(SelectionMode.Partial),
  nodeTypes: writable<NodeTypes>({
    input: InputNode,
    output: OutputNode,
    default: DefaultNode
  }),
  edgeTypes: writable<EdgeTypes>({
    straight: StraightEdge,
    smoothstep: SmoothStepEdge,
    default: BezierEdge
  }),
  transform: writable<Transform>([0, 0, 1]),
  connectionMode: writable<ConnectionMode>(ConnectionMode.Strict),
  domNode: writable<HTMLDivElement | null>(null),
  connectionPath: readable<string | null>(null),
  connection: writable<ConnectionData>(initConnectionData),
  connectionRadius: writable<number>(25),
  connectionLineType: writable<ConnectionLineType>(ConnectionLineType.Bezier)
};
