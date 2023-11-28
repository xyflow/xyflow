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
  type: HandleType;
  position?: Position;
  id?: string;
  class?: string;
  style?: string;
  isConnectable?: boolean;
  isConnectableStart?: boolean;
  isConnectableEnd?: boolean;
};

export type FitViewOptions = FitViewOptionsBase<Node>;

export type OnDelete = (params: { nodes: Node[]; edges: Edge[] }) => void;
export type OnEdgeCreate = (connection: Connection) => Edge | Connection | void;
