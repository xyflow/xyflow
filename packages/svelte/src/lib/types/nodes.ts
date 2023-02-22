import type { SvelteComponentTyped } from 'svelte';
import type { internalsSymbol, NodeHandleBounds, Position, XYPosition } from '@reactflow/system';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Node<NodeData = any> = {
	id: string;
	type: string;
	data: NodeData;
	position: XYPosition;
	sourcePosition?: Position;
	targetPosition?: Position;

	width?: number;
	height?: number;
	selected?: boolean;
	class?: string;
	style?: string;

	// only used internally
	[internalsSymbol]?: {
		z?: number;
		handleBounds?: NodeHandleBounds;
		isParent?: boolean;
	};
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NodeProps<NodeData = any> = Pick<
	Node<NodeData>,
	'id' | 'data' | 'selected' | 'sourcePosition' | 'targetPosition'
> & {
	xPos: number;
	yPos: number;
	isConnectable?: boolean;
};

export type WrapNodeProps = Node & {
	resizeObserver?: ResizeObserver;
};

export type NodeTypes = Record<string, typeof SvelteComponentTyped<NodeProps>>;
