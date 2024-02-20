import type { ShortcutModifierDefinition } from '@svelte-put/shortcut';
import type {
  FitViewOptionsBase,
  HandleType,
  Position,
  XYPosition,
  ConnectingHandle,
  Connection,
  OnBeforeDeleteBase
} from '@xyflow/system';

import type { Node } from './nodes';
import type { Edge } from './edges';

export type KeyModifier = ShortcutModifierDefinition;
export type KeyDefinitionObject = { key: string; modifier?: KeyModifier };
export type KeyDefinition = string | KeyDefinitionObject;

export type ConnectionData = {
  connectionPosition: XYPosition | null;
  connectionStartHandle: ConnectingHandle | null;
  connectionEndHandle: ConnectingHandle | null;
  connectionStatus: string | null;
};

export type HandleComponentProps = {
  /** Type of the handle
   * @example HandleType.Source, HandleType.Target
   */
  type: HandleType;
  /** Position of the handle
   * @example Position.TopLeft, Position.TopRight,
   * Position.BottomLeft, Position.BottomRight
   */
  position?: Position;
  /** Id of the handle
   * @remarks optional if there is only one handle of this type
   */
  id?: string;
  class?: string;
  style?: string;
  /** Should you be able to connect from/to this handle */
  isConnectable?: boolean;
  /** Shoould you be able to connect from this handle */
  isConnectableStart?: boolean;
  /** Should you be able to connect to this handle */
  isConnectableEnd?: boolean;
  onconnect?: (connections: Connection[]) => void;
  ondisconnect?: (connections: Connection[]) => void;
};

export type FitViewOptions = FitViewOptionsBase<Node>;

export type OnDelete = (params: { nodes: Node[]; edges: Edge[] }) => void;
export type OnEdgeCreate = (connection: Connection) => Edge | Connection | void;
export type OnBeforeDelete<
  NodeType extends Node = Node,
  EdgeType extends Edge = Edge
> = OnBeforeDeleteBase<NodeType, EdgeType>;

export type IsValidConnection<EdgeType extends Edge = Edge> = (
  edge: EdgeType | Connection
) => boolean;
