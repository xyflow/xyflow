import type { ShortcutModifierDefinition } from '@svelte-put/shortcut';
import type { ConnectionLineType, HandleType, XYPosition } from '@reactflow/system';

import type { Node, NodeTypes, Edge } from '.';

export type KeyModifier = ShortcutModifierDefinition;
export type KeyDefinitionObject = { key: string; modifier?: KeyModifier };
export type KeyDefinition = string | KeyDefinitionObject;

export type ConnectionData = {
  position: XYPosition | null;
  nodeId: string | null;
  handleId: string | null;
  handleType: HandleType | null;
  status: string | null;
};

export type ConnectionLineProps = {};

export type SvelteFlowProps = {
  nodes: Node[];
  edges: Edge[];

  connectionLineType?: ConnectionLineType;
  selectionKey?: KeyDefinition;
  deleteKey?: KeyDefinition;
  nodeTypes?: NodeTypes;
  fitView?: boolean;
  class?: string;
  style?: string;
  id?: string;
};
