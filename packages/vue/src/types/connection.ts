import type { Connection, ConnectionLineType, EdgeMarkerType, Handle, NodeConnection, Position, XYPosition } from '@xyflow/system';
import type { CSSProperties } from 'vue';
import type { Edge } from './edge';
import type { ClassValue } from './flow';
import type { ConnectingHandle } from './handle';
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
 * An ongoing connection (the active `ConnectionState`). Handles are vue-flow `ConnectingHandle`s (not
 * the DOM `Handle`) and nodes are resolved `InternalNode`s.
 */
export interface ConnectionInProgress<NodeType extends Node = Node> {
  /** Indicates whether a connection is currently in progress. */
  inProgress: true;
  /**
   * If an ongoing connection is above a handle or inside the connection radius, this will be `true`
   * or `false`, otherwise `null`.
   */
  isValid: boolean | null;
  /** Returns the xy start position or `null` if no connection is in progress. */
  from: XYPosition;
  /** Returns the start handle or `null` if no connection is in progress. */
  fromHandle: ConnectingHandle;
  /** Returns the side (called position) of the start handle or `null` if no connection is in progress. */
  fromPosition: Position;
  /** Returns the start node or `null` if no connection is in progress. */
  fromNode: InternalNode<NodeType>;
  /** Returns the xy end position or `null` if no connection is in progress. */
  to: XYPosition;
  /** Returns the end handle or `null` if no connection is in progress. */
  toHandle: ConnectingHandle | null;
  /** Returns the side (called position) of the end handle or `null` if no connection is in progress. */
  toPosition: Position | null;
  /** Returns the end node or `null` if no connection is in progress. */
  toNode: InternalNode<NodeType> | null;
  /** Returns the pointer position or `null` if no connection is in progress. */
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
 * The `ConnectionState` type bundles all information about an ongoing connection. It is returned by the
 * `useConnection` hook.
 */
export type ConnectionState<NodeType extends Node = Node> = ConnectionInProgress<NodeType> | NoConnection;

/**
 * If you want to render a custom component for connection lines, you can pass it to the `connection-line`
 * slot. These props are passed to your custom component.
 */
export interface ConnectionLineProps<NodeType extends Node = Node> {
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
  fromNode: InternalNode<NodeType>;
  /** the handle the connection started from (not the DOM element) */
  fromHandle: Handle | null;
  /** the node the connection currently ends on, or `null` */
  toNode: InternalNode<NodeType> | null;
  /** the handle the connection currently ends on (not the DOM element), or `null` */
  toHandle: Handle | null;
  /** marker url */
  markerStart?: string;
  /** marker url */
  markerEnd?: string;
  /**
   * If there is an `isValidConnection` callback, this prop will be set to `"valid"` or `"invalid"`
   * based on the return value of that callback. Otherwise, it will be `null`.
   */
  connectionStatus: ConnectionStatus | null;
  /** the raw pointer position in flow coordinates (unsnapped, unlike `toX`/`toY`) */
  pointer: XYPosition;
}

export type ConnectionLookup = Map<string, Map<string, NodeConnection>>;
