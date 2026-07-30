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
import type { EdgeChangeset, NodeChangeset } from '$lib/changes';

export type KeyModifier = ShortcutModifierDefinition;
export type KeyDefinitionObject = { key: string; modifier?: KeyModifier };
export type KeyDefinition = string | KeyDefinitionObject;

export type ConnectionData = {
  connectionPosition: XYPosition | null;
  connectionStartHandle: Handle | null;
  connectionEndHandle: Handle | null;
  connectionStatus: string | null;
};

/**
 * @inline
 */
export type FitViewOptions<NodeType extends Node = Node> = FitViewOptionsBase<NodeType>;

/**
 * This type can be used to type the `onDelete` function with a custom node and edge type.
 *
 * @public
 */
export type OnDelete<NodeType extends Node = Node, EdgeType extends Edge = Edge> = (params: {
  nodes: NodeType[];
  edges: EdgeType[];
}) => void;

export type OnBeforeConnect<EdgeType extends Edge = Edge> = (
  connection: Connection
) => EdgeType | Connection | void | false | null;
export type OnBeforeReconnect<EdgeType extends Edge = Edge> = (
  newEdge: EdgeType,
  oldEdge: EdgeType
) => EdgeType | void | false | null;
export type OnBeforeDelete<
  NodeType extends Node = Node,
  EdgeType extends Edge = Edge
> = OnBeforeDeleteBase<NodeType, EdgeType>;

/**
 *  This type can be used to type the `isValidConnection` function.
 *  If the function returns `true`, the connection is valid and can be created.
 */
export type IsValidConnection<EdgeType extends Edge = Edge> = (
  edge: EdgeType | Connection
) => boolean;

export type OnSelectionChange<
  NodeType extends Node = Node,
  EdgeType extends Edge = Edge
> = (params: { nodes: NodeType[]; edges: EdgeType[] }) => void;

export type OnNodesChange<NodeType extends Node = Node> = (
  changes: NodeChangeset<NodeType>
) => void;

export type OnEdgesChange<EdgeType extends Edge = Edge> = (
  changes: EdgeChangeset<EdgeType>
) => void;
