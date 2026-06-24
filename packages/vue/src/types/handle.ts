import type { Connection, ConnectionMode, Dimensions, HandleType, Position, XYPosition } from '@xyflow/system';
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
  /** Unique id of handle element */
  id?: string;
  /** Handle type (source / target) {@link HandleType} */
  type?: HandleType;
  /** Handle position (top, bottom, left, right) {@link Position} */
  position?: Position;
  /** A valid connection func {@link ValidConnectionFunc} */
  isValidConnection?: ValidConnectionFunc;
  /** Enable/disable connecting to handle altogether */
  isConnectable?: HandleConnectable;
  /** Can this handle be used to *start* a connection */
  connectableStart?: boolean;
  /** Can this handle be used to *end* a connection */
  connectableEnd?: boolean;
}

export interface IsValidParams {
  handle: ConnectingHandle | null;
  connectionMode: ConnectionMode;
  fromNodeId: string;
  fromHandleId: string | null;
  fromType: HandleType;
  isValidConnection?: ValidConnectionFunc;
  doc: Document | ShadowRoot;
  lib: string;
  flowId: string | null;
}

export interface Result {
  handleDomNode: Element | null;
  isValid: boolean;
  connection: Connection | null;
  toHandle: ConnectingHandle | null;
}
