import type { Node, NodeTypes } from './nodes';
import type { ShortcutModifierDefinition } from '@svelte-put/shortcut';
import type { Edge, HandleType, XYPosition } from '@reactflow/system';

export type KeyModifier = ShortcutModifierDefinition;
export type KeyDefinitionObject = { key: string; modifier?: KeyModifier };
export type KeyDefinition = string | KeyDefinitionObject;

export type ConnectionData = {
	position: XYPosition | null;
	nodeId: string | null;
	handleId: string | null;
	handleType: HandleType | null;
	status: string | null;
};

export type ConnectionLineProps = {};

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
