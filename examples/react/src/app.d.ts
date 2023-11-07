import { Edge, Node, ReactFlowProps } from '@xyflow/react';

declare global {
  interface GenericTestCase {
    flowProps: Omit<ReactFlowProps, 'nodes' | 'edges'> & { nodes: Node[]; edges: Edge[] };
  }
}
