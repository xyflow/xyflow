import type { Connection, Dimensions, HandleType, Position, XYPosition } from '@xyflow/system';
import type { Edge } from './edge';
import type { InternalNode, Node } from './node';

export interface HandleElement extends XYPosition, Dimensions {
  id?: string | null;
  position: Position;
  type: HandleType;
  nodeId: string;
}

export interface ConnectingHandle extends XYPosition {
  nodeId: string;
  type: HandleType;
  id?: string | null;
  position: Position;
}

/** A valid connection function can determine if an attempted connection is valid or not, i.e. abort creating a new edge */
export type ValidConnectionFunc = (
  connection: Connection,
  elements: { edges: Edge[]; nodes: Node[]; sourceNode: InternalNode; targetNode: InternalNode },
) => boolean;

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
  isValidConnection?: ValidConnectionFunc;
  /**
   * Should you be able to connect to/from this handle.
   * @default true
   */
  isConnectable?: HandleConnectable;
  /**
   * Dictates whether a connection can start from this handle.
   * @default true
   */
  connectableStart?: boolean;
  /**
   * Dictates whether a connection can end on this handle.
   * @default true
   */
  connectableEnd?: boolean;
}
