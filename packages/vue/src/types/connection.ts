import type { ConnectionLineType, EdgeMarkerType, Handle, Position, XYPosition } from '@xyflow/system';
import type { CSSProperties } from 'vue';
import type { ClassValue } from './flow';
import type { InternalNode, Node } from './node';

export interface ConnectionLineOptions {
  type?: ConnectionLineType;
  style?: CSSProperties;
  class?: ClassValue;
  markerEnd?: EdgeMarkerType;
  markerStart?: EdgeMarkerType;
}

export type ConnectionStatus = 'valid' | 'invalid';

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
