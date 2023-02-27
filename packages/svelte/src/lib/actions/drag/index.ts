import { get, type Writable } from 'svelte/store';
import { drag as d3Drag, type D3DragEvent, type SubjectPosition } from 'd3-drag';
import { select } from 'd3-selection';
import type { XYPosition, CoordinateExtent, Transform, Node as RFNode } from '@reactflow/system';

import { getDragItems, hasSelector, calcNextPosition } from './utils';
import type { Node } from '$lib/types';

export type UseDragData = { dx: number; dy: number };
export type UseDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;
export type NodeDragItem = {
	id: string;
	position: XYPosition;
	positionAbsolute: XYPosition;
	// distance from the mouse cursor to the node when start dragging
	distance: XYPosition;
	width?: number | null;
	height?: number | null;
	extent?: 'parent' | CoordinateExtent;
	parentNode?: string;
	dragging?: boolean;
};

type UseDragParams = {
	handleSelector?: string;
	nodeId?: string;
	updateNodePositions: (dragItems: NodeDragItem[], d: boolean, p: boolean) => void;
	nodesStore: Writable<Node[]>;
	transformStore: Writable<Transform>;
};

export default function drag(
	nodeRef: Element,
	{ handleSelector, nodeId, updateNodePositions, nodesStore, transformStore }: UseDragParams
) {
	let dragging = false;
	let dragItems: NodeDragItem[] = [];
	let lastPos: { x: number | null; y: number | null } = { x: null, y: null };

	const selection = select(nodeRef);

	const getPointerPosition = ({ sourceEvent }: UseDragEvent) => {
		const x = sourceEvent.touches ? sourceEvent.touches[0].clientX : sourceEvent.clientX;
		const y = sourceEvent.touches ? sourceEvent.touches[0].clientY : sourceEvent.clientY;
		const transform = get(transformStore);

		const pointerPos = {
			x: (x - transform[0]) / transform[2],
			y: (y - transform[1]) / transform[2]
		};

		// we need the snapped position in order to be able to skip unnecessary drag events
		return {
			xSnapped: pointerPos.x,
			ySnapped: pointerPos.y,
			...pointerPos
		};
	};

	const updateNodes = ({ x, y }: XYPosition) => {
		let hasChange = false;

		dragItems = dragItems.map((n) => {
			const nextPosition = { x: x - n.distance.x, y: y - n.distance.y };
			const updatedPos = calcNextPosition(n, nextPosition, get(nodesStore) as RFNode[]);

			// we want to make sure that we only fire a change event when there is a changes
			hasChange =
				hasChange ||
				n.position.x !== updatedPos.position.x ||
				n.position.y !== updatedPos.position.y;

			n.position = updatedPos.position;
			n.positionAbsolute = updatedPos.positionAbsolute;

			return n;
		});

		if (!hasChange) {
			return;
		}

		updateNodePositions(dragItems, true, true);
		dragging = true;
	};

	const dragHandler = d3Drag()
		.on('start', (event: UseDragEvent) => {
			const pointerPos = getPointerPosition(event);
			console.log(pointerPos);
			lastPos = pointerPos;
			dragItems = getDragItems(get(nodesStore) as RFNode[], pointerPos, nodeId);
		})
		.on('drag', (event: UseDragEvent) => {
			const pointerPos = getPointerPosition(event);

			// skip events without movement
			if ((lastPos.x !== pointerPos.xSnapped || lastPos.y !== pointerPos.ySnapped) && dragItems) {
				lastPos = pointerPos;
				updateNodes(pointerPos);
			}
		})
		.on('end', (event: UseDragEvent) => {
			dragging = false;

			if (dragItems) {
				updateNodePositions(dragItems, false, false);
			}
		})
		.filter((event: MouseEvent) => {
			const target = event.target as HTMLDivElement;
			const isDraggable =
				!event.button &&
				!hasSelector(target, '.nodrag', nodeRef) &&
				(!handleSelector || hasSelector(target, handleSelector, nodeRef));

			return isDraggable;
		});

	selection.call(dragHandler);
}
