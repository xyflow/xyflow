import {
	type Node,
	type ShouldResize,
	type OnResizeStart,
	type OnResize,
	type OnResizeEnd
} from '@xyflow/svelte';

export type ResizeNode = Node<{
	minWidth?: number;
	maxWidth?: number;
	minHeight?: number;
	maxHeight?: number;
	shouldResize?: ShouldResize;
	onResizeStart?: OnResizeStart;
	onResize?: OnResize;
	onResizeEnd?: OnResizeEnd;
	keepAspectRatio?: boolean;
	label?: string;
	isVisible?: boolean;
}>;
