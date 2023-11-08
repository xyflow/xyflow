import { Edge, Node, ReactFlowProps } from '@xyflow/react';

declare global {
  interface FlowConfig {
    flowProps: Omit<ReactFlowProps, 'nodes' | 'edges'> & { nodes: Node[]; edges: Edge[] };
  }
}
