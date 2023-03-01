import type { ConnectionLineType } from '@reactflow/system';

import type { Edge, Node, NodeTypes, KeyDefinition } from '$lib/types';

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
