import type { Node, NodeTypes } from './nodes';
import type { Edge } from './edges';

export type SvelteFlowProps = {
	nodes: Node[];
	edges: Edge[];
	nodeTypes?: NodeTypes;
	fitView?: boolean;
	class?: string;
	style?: string;
};
