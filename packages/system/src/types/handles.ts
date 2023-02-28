import type { XYPosition, Position, Dimensions, OnConnect, Connection } from '.';

export type HandleType = 'source' | 'target';

export type HandleElement = XYPosition &
  Dimensions & {
    id?: string | null;
    position: Position;
  };

export type StartHandle = {
  nodeId: string;
  type: HandleType;
  handleId?: string | null;
};

export type HandleProps = {
  type: HandleType;
  position: Position;
  isConnectable?: boolean;
  onConnect?: OnConnect;
  isValidConnection?: (connection: Connection) => boolean;
  id?: string;
};
