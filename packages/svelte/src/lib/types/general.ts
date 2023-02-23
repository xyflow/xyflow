import type { Node, NodeTypes } from './nodes';
import type { Edge } from './edges';
import type { ShortcutModifierDefinition } from '@svelte-put/shortcut';

export type KeyModifier = ShortcutModifierDefinition;
export type KeyDefinitionObject = { key: string; modifier?: KeyModifier };
export type KeyDefinition = string | KeyDefinitionObject;

export type SvelteFlowProps = {
	nodes: Node[];
	edges: Edge[];

	selectionKey?: KeyDefinition;
	deleteKey?: KeyDefinition;
	nodeTypes?: NodeTypes;
	fitView?: boolean;
	class?: string;
	style?: string;
	id?: string;
};
