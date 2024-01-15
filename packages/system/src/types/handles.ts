import type { Position, OnConnect, IsValidConnection } from '.';

export type HandleType = 'source' | 'target';

export type HandleElement = {
  id?: string | null;
  x: number;
  y: number;
  width: number;
  height: number;
  position: Position;
  type?: HandleType;
};

export type ConnectingHandle = {
  nodeId: string;
  type: HandleType;
  handleId?: string | null;
};

export type ConnectionHandle = {
  id: string | null;
  type: HandleType;
  nodeId: string;
  x: number;
  y: number;
};

export type HandleProps = {
  /** type of the handle
   * @example HandleType.Source, HandleType.Target
   */
  type: HandleType;
  /** position of the handle
   * @example Position.TopLeft, Position.TopRight,
   * Position.BottomLeft, Position.BottomRight
   */
  position: Position;
  /** should you be able to connect to/from this handle */
  isConnectable?: boolean;
  /** shoud you be able to connect from this handle */
  isConnectableStart?: boolean;
  /** should you be able to connect to this handle */
  isConnectableEnd?: boolean;
  /** callback called when connection is made */
  onConnect?: OnConnect;
  /** callback if connection is valid
   * @remarks connection becomes an edge if isValidConnection returns true
   */
  isValidConnection?: IsValidConnection;
  /** id of the handle
   * @remarks optional if there is only one handle of this type
   */
  id?: string;
};
