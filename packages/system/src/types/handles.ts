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
  type: HandleType;
  position: Position;
  isConnectable?: boolean;
  isConnectableStart?: boolean;
  isConnectableEnd?: boolean;
  onConnect?: OnConnect;
  isValidConnection?: IsValidConnection;
  id?: string;
};
