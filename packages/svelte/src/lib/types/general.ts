import type { ShortcutModifierDefinition } from '@svelte-put/shortcut';
import type {
  FitViewOptionsBase,
  XYPosition,
  Handle,
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
  connectionStartHandle: Handle | null;
  connectionEndHandle: Handle | null;
  connectionStatus: string | null;
};

export type FitViewOptions<NodeType extends Node = Node> = FitViewOptionsBase<NodeType>;

export type OnDelete<NodeType extends Node = Node, EdgeType extends Edge = Edge> = (params: {
  nodes: NodeType[];
  edges: EdgeType[];
}) => void;

export type OnBeforeConnect<EdgeType extends Edge = Edge> = (
  connection: Connection
) => EdgeType | Connection | void;
export type OnBeforeReconnect<EdgeType extends Edge = Edge> = (
  newEdge: EdgeType,
  oldEdge: EdgeType
) => EdgeType | void;
export type OnBeforeDelete<
  NodeType extends Node = Node,
  EdgeType extends Edge = Edge
> = OnBeforeDeleteBase<NodeType, EdgeType>;

export type IsValidConnection<EdgeType extends Edge = Edge> = (
  edge: EdgeType | Connection
) => boolean;

export type OnSelectionChanged<
  NodeType extends Node = Node,
  EdgeType extends Edge = Edge
> = (params: { nodes: NodeType[]; edges: EdgeType[] }) => void;
