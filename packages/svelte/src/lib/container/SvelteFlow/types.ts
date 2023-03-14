import type {
  Connection,
  ConnectionLineType,
  NodeOrigin,
  OnConnectStartParams,
  Viewport
} from '@reactflow/system';

import type {
  Edge,
  Node,
  NodeTypes,
  KeyDefinition,
  EdgeTypes,
  IsValidConnection
} from '$lib/types';

export type SvelteFlowProps = {
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
  isValidConnection?: IsValidConnection;
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
