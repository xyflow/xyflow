// See https://kit.svelte.dev/docs/types#app

import type { Edge, Node, SvelteFlowProps } from '@xyflow/svelte';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	interface GenericTestCase {
		svelteFlowProps: Omit<SvelteFlowProps, 'nodes' | 'edges'> & { nodes: Node[]; edges: Edge[] };
	}
}

export {};
