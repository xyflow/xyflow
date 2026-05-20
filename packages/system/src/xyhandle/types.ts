import {
  ConnectionMode,
  type Connection,
  type OnConnect,
  type OnConnectStart,
  type HandleType,
  type PanBy,
  type Transform,
  type Handle,
  type OnConnectEnd,
  type UpdateConnection,
  type IsValidConnection,
  NodeLookup,
  FinalConnectionState,
  NodeBase,
  InternalNodeBase,
  EdgeBase,
} from '../types';

export type OnPointerDownParams<NodeType extends NodeBase = NodeBase, EdgeType extends EdgeBase = EdgeBase> = {
  autoPanOnConnect: boolean;
  connectionMode: ConnectionMode;
  connectionRadius: number;
  domNode: HTMLDivElement | null;
  handleId: string | null;
  nodeId: string;
  isTarget: boolean;
  nodeLookup: NodeLookup<InternalNodeBase<NodeType>>;
  lib: string;
  flowId: string | null;
  edgeUpdaterType?: HandleType;
  updateConnection: UpdateConnection<InternalNodeBase<NodeType>>;
  panBy: PanBy;
  cancelConnection: () => void;
  onConnectStart?: OnConnectStart;
  onConnect?: OnConnect;
  onConnectEnd?: OnConnectEnd<NodeType>;
  isValidConnection?: IsValidConnection<EdgeType>;
  onReconnectEnd?: (
    evt: MouseEvent | TouchEvent,
    connectionState: FinalConnectionState<InternalNodeBase<NodeType>>
  ) => void;
  getTransform: () => Transform;
  getFromHandle: () => Handle | null;
  autoPanSpeed?: number;
  dragThreshold?: number;
  handleDomNode: Element;
};

export type IsValidParams<NodeType extends NodeBase = NodeBase, EdgeType extends EdgeBase = EdgeBase> = {
  handle: Pick<Handle, 'nodeId' | 'id' | 'type'> | null;
  connectionMode: ConnectionMode;
  fromNodeId: string;
  fromHandleId: string | null;
  fromType: HandleType;
  isValidConnection?: IsValidConnection<EdgeType>;
  doc: Document | ShadowRoot;
  lib: string;
  flowId: string | null;
  nodeLookup: NodeLookup<InternalNodeBase<NodeType>>;
};

export type XYHandleInstance = {
  onPointerDown: (event: MouseEvent | TouchEvent, params: OnPointerDownParams) => void;
  isValid: (event: MouseEvent | TouchEvent, params: IsValidParams) => Result;
};

export type Result = {
  handleDomNode: Element | null;
  isValid: boolean;
  connection: Connection | null;
  toHandle: Handle | null;
};
