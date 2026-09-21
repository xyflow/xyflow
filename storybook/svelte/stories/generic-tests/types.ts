import type { SvelteFlowProps, Node, Edge } from '@xyflow/svelte';

export type FlowConfig = {
  flowProps: Omit<SvelteFlowProps, 'nodes' | 'edges'> & { nodes: Node[]; edges: Edge[] };
};
