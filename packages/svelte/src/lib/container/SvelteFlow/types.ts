import type {
  Connection,
  ConnectionLineType,
  NodeOrigin,
  OnConnectStartParams,
  Viewport
} from '@reactflow/system';

import type { Edge, Node, NodeTypes, KeyDefinition, EdgeTypes } from '$lib/types';
import type { Writable } from 'svelte/store';
import type { createNodes } from '$lib/utils';

export type SvelteFlowProps = {
  nodes: ReturnType<typeof createNodes>;
  edges: Writable<Edge[]>;

  id?: string;
  nodeTypes?: NodeTypes;
  edgeTypes?: EdgeTypes;
  selectionKey?: KeyDefinition;
  deleteKey?: KeyDefinition;
  fitView?: boolean;
  nodeOrigin?: NodeOrigin;
  minZoom?: number;
  maxZoom?: number;
  initialViewport?: Viewport;
  connectionRadius?: number;

  class?: string;
  style?: string;

  connectionLineType?: ConnectionLineType;
};

export type SvelteFlowEvents = {
  'node:click': CustomEvent<Node>;
  'node:mouseenter': CustomEvent<Node>;
  'node:mousemove': CustomEvent<Node>;
  'node:mouseleave': CustomEvent<Node>;
  'edge:click': CustomEvent<Edge>;
  'connect:start': CustomEvent<OnConnectStartParams>;
  connect: CustomEvent<Connection>;
  'connect:end': CustomEvent<OnConnectStartParams>;
  'pane:click': CustomEvent;
  'pane:contextmenu': CustomEvent;
};

export type SvelteFlowSlots = {
  default: { slotValue: string };
};
