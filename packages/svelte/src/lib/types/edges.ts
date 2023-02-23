import type { SvelteComponentTyped } from 'svelte';
import type { Position } from '@reactflow/system';

export type Edge = {
	id: string;
	type: string;
	source: string;
	target: string;
	sourceHandle?: string;
	targetHandle?: string;
	selected?: boolean;
	deletable?: boolean;
};

export type EdgeProps = {
	id: string;
	sourceX: number;
	sourceY: number;
	targetX: number;
	targetY: number;
	sourcePosition?: Position;
	targetPosition?: Position;
};

export type EdgeTypes = Record<string, typeof SvelteComponentTyped<EdgeProps>>;
