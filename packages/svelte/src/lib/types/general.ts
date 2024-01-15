import type { ShortcutModifierDefinition } from '@svelte-put/shortcut';
import type {
  FitViewOptionsBase,
  HandleType,
  Position,
  XYPosition,
  ConnectingHandle,
  Connection
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
  /** type of the handle
   * @example HandleType.Source, HandleType.Target
   */
  type: HandleType;
  /** position of the handle
   * @example Position.TopLeft, Position.TopRight,
   * Position.BottomLeft, Position.BottomRight
   */
  position?: Position;
  /** id of the handle
   * @remarks optional if there is only one handle of this type
   */
  id?: string;
  class?: string;
  style?: string;
  /** should you be able to connect from/to this handle */
  isConnectable?: boolean;
  /** shoould you be able to connect from this handle */
  isConnectableStart?: boolean;
  /** should you be able to connect to this handle */
  isConnectableEnd?: boolean;
  onconnect?: (connections: Connection[]) => void;
  ondisconnect?: (connections: Connection[]) => void;
};

export type FitViewOptions = FitViewOptionsBase<Node>;

export type OnDelete = (params: { nodes: Node[]; edges: Edge[] }) => void;
export type OnEdgeCreate = (connection: Connection) => Edge | Connection | void;
