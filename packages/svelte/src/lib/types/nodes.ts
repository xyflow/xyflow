import type { SvelteComponentTyped } from 'svelte';
import type { internalsSymbol, NodeHandleBounds, Position, XYPosition } from '@reactflow/system';

// @todo: currently the helper function only like Node from '@reactflow/core'
// we need a base node type or helpes that accept Node like types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Node<NodeData = any> = {
	id: string;
	type: string;
	data: NodeData;
	position: XYPosition;
	sourcePosition?: Position;
	targetPosition?: Position;
	positionAbsolute?: XYPosition;

	width?: number;
	height?: number;
	selected?: boolean;
	class?: string;
	style?: string;
	deletable?: boolean;
	// not supported yet
	parentNode?: string;

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
	resizeObserver?: ResizeObserver | null;
};

export type NodeTypes = Record<string, typeof SvelteComponentTyped<Partial<NodeProps>>>;
