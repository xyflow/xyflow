// See https://kit.svelte.dev/docs/types#app

import type {
	BackgroundProps,
	Edge,
	MiniMap,
	MiniMapProps,
	Node,
	PanelProps,
	SvelteFlowProps
} from '@xyflow/svelte';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	interface FlowConfig {
		flowProps?: Omit<SvelteFlowProps, 'nodes' | 'edges'> & { nodes: Node[]; edges: Edge[] };
		panelProps?: PanelProps;
		backgroundProps?: BackgroundProps;
		controlsProps?: ControlsProps;
		minimapProps?: MiniMapProps;
	}
}

export {};
