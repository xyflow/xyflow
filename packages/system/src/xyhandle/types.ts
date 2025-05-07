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
  type NodeLookup,
  type NodeBase,
  type InternalNodeBase,
  type EdgeBase,
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
  onReconnectEnd?: OnConnectEnd<NodeType>;
  isValidConnection?: IsValidConnection<EdgeType>;
  getTransform: () => Transform;
  getFromHandle: () => Handle | null;
  autoPanSpeed?: number;
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
  onPointerDown: <NodeType extends NodeBase = NodeBase, EdgeType extends EdgeBase = EdgeBase>(event: MouseEvent | TouchEvent, params: OnPointerDownParams<NodeType, EdgeType>) => void;
  isValid: <NodeType extends NodeBase = NodeBase, EdgeType extends EdgeBase = EdgeBase>(event: MouseEvent | TouchEvent, params: IsValidParams<NodeType, EdgeType>) => Result;
};

export type Result = {
  handleDomNode: Element | null;
  isValid: boolean;
  connection: Connection | null;
  toHandle: Handle | null;
};
