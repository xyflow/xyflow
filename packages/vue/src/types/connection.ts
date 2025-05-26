import type { Connection, ConnectionLineType, HandleType, NodeConnection, Position, XYPosition } from '@xyflow/system';
import type { CSSProperties } from 'vue';
import type { Edge, EdgeMarkerType } from './edge';
import type { ClassValue } from './flow';
import type { ConnectingHandle, HandleElement } from './handle';
import type { InternalNode, Node } from './node';

export interface ConnectionLineOptions {
  type?: ConnectionLineType;
  style?: CSSProperties;
  class?: ClassValue;
  markerEnd?: EdgeMarkerType;
  markerStart?: EdgeMarkerType;
}

export type Connector = (
  params: Connection,
) => Promise<(Connection & Partial<Edge>) | false> | ((Connection & Partial<Edge>) | false);

export type ConnectionStatus = 'valid' | 'invalid';

/**
 * An ongoing connection, mirroring xyflow/react's `ConnectionState` (returned by `useConnection`).
 * Handles are vue-flow `ConnectingHandle`s and nodes are `InternalNode`s (the resolved `InternalNode`s).
 */
export interface ConnectionInProgress<NodeType extends Node = Node> {
  inProgress: true;
  /** `true`/`false` when over a handle or inside the connection radius, otherwise `null` */
  isValid: boolean | null;
  /** xy start position of the connection */
  from: XYPosition;
  /** the handle the connection started from */
  fromHandle: ConnectingHandle;
  /** the side of the start handle */
  fromPosition: Position;
  /** the node the connection started from */
  fromNode: InternalNode<NodeType>;
  /** xy end position of the connection (the current pointer position) */
  to: XYPosition;
  /** the handle the connection currently ends on, or `null` */
  toHandle: ConnectingHandle | null;
  /** the side of the end handle, or `null` */
  toPosition: Position | null;
  /** the node the connection currently ends on, or `null` */
  toNode: InternalNode<NodeType> | null;
  /** the current pointer position */
  pointer: XYPosition;
}

/** No connection in progress — the resting `ConnectionState`. */
export interface NoConnection {
  inProgress: false;
  isValid: null;
  from: null;
  fromHandle: null;
  fromPosition: null;
  fromNode: null;
  to: null;
  toHandle: null;
  toPosition: null;
  toNode: null;
  pointer: null;
}

/**
 * The full connection state bundled for `useConnection`, mirroring xyflow/react's `ConnectionState`.
 */
export type ConnectionState<NodeType extends Node = Node> = ConnectionInProgress<NodeType> | NoConnection;

/** The source nodes params when connection is initiated */
export interface OnConnectStartParams {
  /** Source node id */
  nodeId?: string;
  /** Source handle id */
  handleId: string | null;
  /** Source handle type */
  handleType?: HandleType;
}

export interface ConnectionLineProps {
  /** X start position of the connection line */
  fromX: number;
  /** Y start position of the connection line */
  fromY: number;
  /** the side of the start handle */
  fromPosition: Position;
  /** X end position of the connection line (the current pointer) */
  toX: number;
  /** Y end position of the connection line (the current pointer) */
  toY: number;
  /** the side of the end handle */
  toPosition: Position;
  /** the node the connection started from */
  fromNode: InternalNode;
  /** the handle the connection started from (not the DOM element) */
  fromHandle: HandleElement | null;
  /** the node the connection currently ends on, or `null` */
  toNode: InternalNode | null;
  /** the handle the connection currently ends on (not the DOM element), or `null` */
  toHandle: HandleElement | null;
  /** marker url */
  markerStart?: string;
  /** marker url */
  markerEnd?: string;
  /** status of the connection (valid, invalid) */
  connectionStatus: ConnectionStatus | null;
  /** the raw pointer position in flow coordinates (unsnapped, unlike `toX`/`toY`) */
  pointer: XYPosition;
}

export type ConnectionLookup = Map<string, Map<string, NodeConnection>>;
