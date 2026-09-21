import type { ReactFlowProps, Node, Edge } from '@xyflow/react';

export type FlowConfig = {
  flowProps: Omit<ReactFlowProps, 'nodes' | 'edges'> & { nodes: Node[]; edges: Edge[] };
};
