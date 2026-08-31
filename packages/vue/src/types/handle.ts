import type { HandleType, IsValidConnection, Position } from '@xyflow/system';
import type { Edge } from './edge';
import type { InternalNode } from './node';

export type HandleConnectableFunc = (node: InternalNode, connectedEdges: Edge[]) => boolean;

/**
 * set to true to allow unlimited connections,
 * single for only one connection
 * or use a cb function to determine connect-ability
 *
 * if set to single and the handle already has more than one connection, it will act the same as setting it to false
 */
export type HandleConnectable = boolean | number | 'single' | HandleConnectableFunc;

export interface HandleProps {
  /**
   * Id of the handle.
   * @remarks optional if there is only one handle of this type
   */
  id?: string;
  /**
   * Type of the handle.
   * @default "source"
   */
  type?: HandleType;
  /**
   * The position of the handle relative to the node. In a horizontal flow source handles are
   * typically `Position.Right` and in a vertical flow they are typically `Position.Top`.
   * @default Position.Top
   * @example Position.Top, Position.Right, Position.Bottom, Position.Left
   */
  position?: Position;
  /**
   * Called when a connection is dragged to this handle. You can use this callback to perform some
   * custom validation logic based on the connection target and source, for example. Where possible,
   * we recommend you move this logic to the `isValidConnection` prop on the `<VueFlow />` component
   * for performance reasons.
   * @remarks connection becomes an edge if isValidConnection returns true
   */
  isValidConnection?: IsValidConnection;
  /**
   * Should you be able to connect to/from this handle.
   * @default true
   */
  isConnectable?: HandleConnectable;
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
}
