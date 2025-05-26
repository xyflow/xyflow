import type { Connection, FinalConnectionState, HandleType, Viewport } from '@xyflow/system';
import type { EventHookExtended, EventHookOn, EventHookTrigger, VueFlowError } from '../utils';
import type { EdgeChange, NodeChange } from './changes';
import type { OnConnectStartParams } from './connection';
import type { Edge } from './edge';
import type { InternalNode, Node } from './node';
import type { VueFlowInstance } from './store';

export type MouseTouchEvent = MouseEvent | TouchEvent;

export interface NodeMouseEvent<NodeType extends Node = Node> {
  event: MouseTouchEvent;
  node: NodeType;
}

export interface NodeDragEvent<NodeType extends Node = Node> {
  event: MouseTouchEvent;
  node: NodeType;
  nodes: NodeType[];
}

export interface EdgeMouseEvent<EdgeType extends Edge = Edge> {
  event: MouseTouchEvent;
  edge: EdgeType;
}

export interface EdgeReconnectEvent<EdgeType extends Edge = Edge> {
  event: MouseTouchEvent;
  edge: EdgeType;
  connection: Connection;
}

/**
 * Payload for `connectEnd`/`clickConnectEnd` — the pointer event plus the {@link FinalConnectionState}
 * (whether the connection was valid, the from/to handles and nodes), mirroring xyflow/react's `OnConnectEnd`.
 */
export interface ConnectEndEvent<NodeType extends Node = Node> {
  event: MouseTouchEvent;
  connectionState: FinalConnectionState<InternalNode<NodeType>>;
}

export interface EdgeReconnectStartEvent<EdgeType extends Edge = Edge> {
  event: MouseTouchEvent;
  edge: EdgeType;
  /** the type of the handle being reconnected (the fixed end, opposite the grabbed anchor), as in xyflow/react */
  handleType: HandleType;
}

export interface EdgeReconnectEndEvent<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  event: MouseTouchEvent;
  edge: EdgeType;
  /** the type of the handle that was reconnected */
  handleType: HandleType;
  /** the {@link FinalConnectionState} at the moment the reconnect ended */
  connectionState: FinalConnectionState<InternalNode<NodeType>>;
}

/** Payload for `selectionChange` — the currently selected nodes and edges, mirroring xyflow/react's `OnSelectionChange`. */
export interface SelectionChangeEvent<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  nodes: NodeType[];
  edges: EdgeType[];
}

export interface FlowEvents<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  nodesChange: NodeChange<NodeType>[];
  edgesChange: EdgeChange<EdgeType>[];
  nodeDoubleClick: NodeMouseEvent<NodeType>;
  nodeClick: NodeMouseEvent<NodeType>;
  nodeMouseEnter: NodeMouseEvent<NodeType>;
  nodeMouseMove: NodeMouseEvent<NodeType>;
  nodeMouseLeave: NodeMouseEvent<NodeType>;
  nodeContextMenu: NodeMouseEvent<NodeType>;
  nodeDragStart: NodeDragEvent<NodeType>;
  nodeDrag: NodeDragEvent<NodeType>;
  nodeDragStop: NodeDragEvent<NodeType>;
  nodesInitialized: NodeType[];
  updateNodeInternals: string[];
  miniMapNodeClick: NodeMouseEvent<NodeType>;
  miniMapNodeDoubleClick: NodeMouseEvent<NodeType>;
  miniMapNodeMouseEnter: NodeMouseEvent<NodeType>;
  miniMapNodeMouseMove: NodeMouseEvent<NodeType>;
  miniMapNodeMouseLeave: NodeMouseEvent<NodeType>;
  connect: Connection;
  connectStart: {
    event?: MouseEvent | TouchEvent;
  } & OnConnectStartParams;
  connectEnd: ConnectEndEvent<NodeType>;
  clickConnectStart: {
    event?: MouseEvent | TouchEvent;
  } & OnConnectStartParams;
  clickConnectEnd: ConnectEndEvent<NodeType>;
  init: VueFlowInstance<NodeType, EdgeType>;
  move: { event: MouseTouchEvent | null; viewport: Viewport };
  moveStart: { event: MouseTouchEvent | null; viewport: Viewport };
  moveEnd: { event: MouseTouchEvent | null; viewport: Viewport };
  selectionDragStart: NodeDragEvent<NodeType>;
  selectionDrag: NodeDragEvent<NodeType>;
  selectionDragStop: NodeDragEvent<NodeType>;
  selectionContextMenu: { event: MouseEvent; nodes: NodeType[] };
  selectionStart: MouseEvent;
  selectionEnd: MouseEvent;
  selectionChange: SelectionChangeEvent<NodeType, EdgeType>;
  viewportChangeStart: Viewport;
  viewportChange: Viewport;
  viewportChangeEnd: Viewport;
  paneScroll: WheelEvent | undefined;
  paneClick: MouseEvent;
  paneContextMenu: MouseEvent;
  paneMouseEnter: PointerEvent;
  paneMouseMove: PointerEvent;
  paneMouseLeave: PointerEvent;
  edgeContextMenu: EdgeMouseEvent<EdgeType>;
  edgeMouseEnter: EdgeMouseEvent<EdgeType>;
  edgeMouseMove: EdgeMouseEvent<EdgeType>;
  edgeMouseLeave: EdgeMouseEvent<EdgeType>;
  edgeDoubleClick: EdgeMouseEvent<EdgeType>;
  edgeClick: EdgeMouseEvent<EdgeType>;
  reconnectStart: EdgeReconnectStartEvent<EdgeType>;
  reconnect: EdgeReconnectEvent<EdgeType>;
  reconnectEnd: EdgeReconnectEndEvent<NodeType, EdgeType>;
  error: VueFlowError;
}

export type FlowHooks<NodeType extends Node = Node, EdgeType extends Edge = Edge> = Readonly<{
  [key in keyof FlowEvents<NodeType, EdgeType>]: EventHookExtended<FlowEvents<NodeType, EdgeType>[key]>
}>;

export type FlowHooksOn<NodeType extends Node = Node, EdgeType extends Edge = Edge> = Readonly<{
  [key in keyof FlowEvents<NodeType, EdgeType> as `on${Capitalize<key>}`]: EventHookOn<FlowEvents<NodeType, EdgeType>[key]>
}>;

export type FlowHooksEmit<NodeType extends Node = Node, EdgeType extends Edge = Edge> = Readonly<{
  [key in keyof FlowEvents<NodeType, EdgeType>]: EventHookTrigger<FlowEvents<NodeType, EdgeType>[key]>
}>;

export interface NodeEventsHandler<NodeType extends Node = Node> {
  doubleClick: (event: NodeMouseEvent<NodeType>) => void | { off: () => void };
  click: (event: NodeMouseEvent<NodeType>) => void | { off: () => void };
  mouseEnter: (event: NodeMouseEvent<NodeType>) => void | { off: () => void };
  mouseMove: (event: NodeMouseEvent<NodeType>) => void | { off: () => void };
  mouseLeave: (event: NodeMouseEvent<NodeType>) => void | { off: () => void };
  contextMenu: (event: NodeMouseEvent<NodeType>) => void | { off: () => void };
  dragStart: (event: NodeDragEvent<NodeType>) => void | { off: () => void };
  drag: (event: NodeDragEvent<NodeType>) => void | { off: () => void };
  dragStop: (event: NodeDragEvent<NodeType>) => void | { off: () => void };
}

export type NodeEventsOn<NodeType extends Node = Node> = {
  [key in keyof NodeEventsHandler<NodeType>]: EventHookOn<
    NodeEventsHandler<NodeType>[key] extends (event: infer Event) => any ? Event : never
  >
};

export type NodeEventsEmit<NodeType extends Node = Node> = {
  [key in keyof NodeEventsHandler<NodeType>]: EventHookTrigger<
    NodeEventsHandler<NodeType>[key] extends (event: infer Event) => any ? Event : never
  >
};

export interface EdgeEventsHandler<EdgeType extends Edge = Edge> {
  doubleClick: (event: EdgeMouseEvent<EdgeType>) => void | { off: () => void };
  click: (event: EdgeMouseEvent<EdgeType>) => void | { off: () => void };
  mouseEnter: (event: EdgeMouseEvent<EdgeType>) => void | { off: () => void };
  mouseMove: (event: EdgeMouseEvent<EdgeType>) => void | { off: () => void };
  mouseLeave: (event: EdgeMouseEvent<EdgeType>) => void | { off: () => void };
  contextMenu: (event: EdgeMouseEvent<EdgeType>) => void | { off: () => void };
  reconnectStart: (event: EdgeReconnectStartEvent<EdgeType>) => void | { off: () => void };
  reconnect: (event: EdgeReconnectEvent<EdgeType>) => void | { off: () => void };
  reconnectEnd: (event: EdgeReconnectEndEvent<Node, EdgeType>) => void | { off: () => void };
}

export type EdgeEventsOn<EdgeType extends Edge = Edge> = {
  [key in keyof EdgeEventsHandler<EdgeType>]: EventHookOn<
    EdgeEventsHandler<EdgeType>[key] extends (event: infer Event) => any ? Event : never
  >
};

export type EdgeEventsEmit<EdgeType extends Edge = Edge> = {
  [key in keyof EdgeEventsHandler<EdgeType>]: EventHookTrigger<
    EdgeEventsHandler<EdgeType>[key] extends (event: infer Event) => any ? Event : never
  >
};
