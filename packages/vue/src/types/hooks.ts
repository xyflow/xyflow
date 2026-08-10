import type { Connection, FinalConnectionState, HandleType, OnConnectStartParams, Viewport } from '@xyflow/system';
import type { EventHookExtended, EventHookOn, EventHookTrigger, VueFlowError } from '../utils';
import type { EdgeChange, NodeChange } from './changes';
import type { Edge } from './edge';
import type { InternalNode, Node } from './node';
import type { VueFlowInstance } from './store';

/** A DOM `MouseEvent` or `TouchEvent`. */
export type MouseTouchEvent = MouseEvent | TouchEvent;

/** Payload for the node pointer events (`nodeClick`, `nodeMouseEnter`, `nodeContextMenu`, …). */
export interface NodeMouseEvent<NodeType extends Node = Node> {
  /** The DOM event that triggered this. */
  event: MouseTouchEvent;
  /** The node the event refers to. */
  node: NodeType;
}

/** Payload for the node drag events (`nodeDragStart`, `nodeDrag`, `nodeDragStop`). */
export interface NodeDragEvent<NodeType extends Node = Node> {
  /** The DOM event driving the drag. */
  event: MouseTouchEvent;
  /** The node being dragged. */
  node: NodeType;
  /** All nodes being dragged together (the grabbed node plus any others in the selection). */
  nodes: NodeType[];
}

/** Payload for the edge pointer events (`edgeClick`, `edgeMouseEnter`, `edgeContextMenu`, …). */
export interface EdgeMouseEvent<EdgeType extends Edge = Edge> {
  /** The DOM event that triggered this. */
  event: MouseTouchEvent;
  /** The edge the event refers to. */
  edge: EdgeType;
}

/** Payload for the `reconnect` event — fired once an edge has been reconnected to a new handle. */
export interface EdgeReconnectEvent<EdgeType extends Edge = Edge> {
  /** The DOM event that completed the reconnect. */
  event: MouseTouchEvent;
  /** The edge that was reconnected. */
  edge: EdgeType;
  /** The new connection the edge now describes. */
  connection: Connection;
}

/**
 * Payload for `connectEnd`/`clickConnectEnd` — the pointer event plus the {@link FinalConnectionState}
 * (whether the connection was valid, the from/to handles and nodes).
 */
export interface ConnectEndEvent<NodeType extends Node = Node> {
  /** The DOM event that ended the connection attempt. */
  event: MouseTouchEvent;
  /** The final connection state — validity plus the from/to handles and nodes. */
  connectionState: FinalConnectionState<InternalNode<NodeType>>;
}

/** Payload for the `reconnectStart` event — fired when the user grabs an edge endpoint to reconnect it. */
export interface EdgeReconnectStartEvent<EdgeType extends Edge = Edge> {
  /** The DOM event that started the reconnect. */
  event: MouseTouchEvent;
  /** The edge being reconnected. */
  edge: EdgeType;
  /** the type of the handle being reconnected (the fixed end, opposite the grabbed anchor) */
  handleType: HandleType;
}

/** Payload for the `reconnectEnd` event — fired when a reconnect gesture ends, whether or not it succeeded. */
export interface EdgeReconnectEndEvent<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  /** The DOM event that ended the reconnect. */
  event: MouseTouchEvent;
  /** The edge that was being reconnected. */
  edge: EdgeType;
  /** the type of the handle that was reconnected */
  handleType: HandleType;
  /** the {@link FinalConnectionState} at the moment the reconnect ended */
  connectionState: FinalConnectionState<InternalNode<NodeType>>;
}

/** Payload for `selectionChange` — the currently selected nodes and edges. */
export interface SelectionChangeEvent<NodeType extends Node = Node, EdgeType extends Edge = Edge> {
  /** The currently selected nodes. */
  nodes: NodeType[];
  /** The currently selected edges. */
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
  nodesDelete: NodeType[];
  edgesDelete: EdgeType[];
  delete: { nodes: NodeType[]; edges: EdgeType[] };
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
