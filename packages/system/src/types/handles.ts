import type { Position, IsValidConnection } from '.';

/**
 * @inline
 */
export type HandleType = 'source' | 'target';

export type Handle = {
  id?: string | null;
  nodeId: string;
  x: number;
  y: number;
  position: Position;
  type: HandleType;
  width: number;
  height: number;
};

export type HandleProps = {
  /**
   * Type of the handle.
   * @default "source"
   */
  type: HandleType;
  /**
   * The position of the handle relative to the node. In a horizontal flow source handles are
   * typically `Position.Right` and in a vertical flow they are typically `Position.Top`.
   * @default Position.Top
   * @example Position.Top, Position.Right, Position.Bottom, Position.Left
   */
  position: Position;
  /**
   * Should you be able to connect to/from this handle.
   * @default true
   */
  isConnectable?: boolean;
  /**
   * Dictates whether a connection can start from this handle.
   * @default true
   */
  isConnectableStart?: boolean;
  /**
   * Dictates whether a connection can end on this handle.
   * @default true
   */
  isConnectableEnd?: boolean;
  /**
   * Called when a connection is dragged to this handle. You can use this callback to perform some
   * custom validation logic based on the connection target and source, for example. Where possible,
   * we recommend you move this logic to the `isValidConnection` prop on the main ReactFlow
   * component for performance reasons.
   * @remarks connection becomes an edge if isValidConnection returns true
   */
  isValidConnection?: IsValidConnection;
  /**
   * Id of the handle.
   * @remarks optional if there is only one handle of this type
   */
  id?: string | null;
};
