import { roundUp, roundDown } from './utils';
import type { Node, XYPosition } from '../../../types';

export type NodeBoundingBox = {
	id: string;
	width: number;
	height: number;
	topLeft: XYPosition;
	bottomLeft: XYPosition;
	topRight: XYPosition;
	bottomRight: XYPosition;
};

export type GraphBoundingBox = {
	width: number;
	height: number;
	topLeft: XYPosition;
	bottomLeft: XYPosition;
	topRight: XYPosition;
	bottomRight: XYPosition;
	xMax: number;
	yMax: number;
	xMin: number;
	yMin: number;
};

/**
 * Get the bounding box of all nodes and the graph itself, as X/Y coordinates
 * of all corner points.
 *
 * @param storeNodes The node list
 * @param nodePadding Optional padding to add to the node's bounding boxes
 * @param graphPadding Optional padding to add to the graph's bounding box
 * @param roundTo If the coordinates should be rounded to this nearest integer
 * @returns Graph and nodes bounding boxes.
 */
export const getBoundingBoxes = (
	storeNodes: Node[],
	nodePadding = 0,
	graphPadding = 0,
	roundTo = 0,
) => {
	// Guarantee that the given parameters are positive integers
	nodePadding = Math.max(Math.round(nodePadding), 0);
	graphPadding = Math.max(Math.round(graphPadding), 0);
	roundTo = Math.max(Math.round(roundTo), 0);

	nodePadding = Number.isInteger(nodePadding) ? nodePadding : 0;
	graphPadding = Number.isInteger(graphPadding) ? graphPadding : 0;
	roundTo = Number.isInteger(roundTo) ? roundTo : 0;

  let xMax = Number.MIN_SAFE_INTEGER;
	let yMax = Number.MIN_SAFE_INTEGER;
	let xMin = Number.MAX_SAFE_INTEGER;
	let yMin = Number.MAX_SAFE_INTEGER;

	const nodes: NodeBoundingBox[] = storeNodes.map((node) => {
		const rf = node?.__rf;
		const width = Math.max(rf?.width || 0, 1);
		const height = Math.max(rf?.height || 0, 1);

		const position: XYPosition = {
			x: rf?.position?.x || 0,
			y: rf?.position?.y || 0,
		};
		const topLeft: XYPosition = {
			x: position.x - nodePadding,
			y: position.y - nodePadding,
		};
		const bottomLeft: XYPosition = {
			x: position.x - nodePadding,
			y: (position.y + height) + nodePadding,
		};
		const topRight: XYPosition = {
			x: (position.x + width) + nodePadding,
			y: position.y - nodePadding,
		};
		const bottomRight: XYPosition = {
			x: (position.x + width) + nodePadding,
			y: (position.y + height) + nodePadding,
		};

		if (roundTo > 0) {
			topLeft.x = roundDown(topLeft.x, roundTo);
			topLeft.y = roundDown(topLeft.y, roundTo);
			bottomLeft.x = roundDown(bottomLeft.x, roundTo);
			bottomLeft.y = roundUp(bottomLeft.y, roundTo);
			topRight.x = roundUp(topRight.x, roundTo);
			topRight.y = roundDown(topRight.y, roundTo);
			bottomRight.x = roundUp(bottomRight.x, roundTo);
			bottomRight.y = roundUp(bottomRight.y, roundTo);
		}

		if (topLeft.y < yMin) yMin = topLeft.y;
		if (topLeft.x < xMin) xMin = topLeft.x;
		if (bottomRight.y > yMax) yMax = bottomRight.y;
		if (bottomRight.x > xMax) xMax = bottomRight.x;

		return {
			id: node.id,
			width,
			height,
			topLeft,
			bottomLeft,
			topRight,
			bottomRight,
		};
	});

	xMax = xMax + graphPadding;
	yMax = yMax + graphPadding;
	xMin = xMin - graphPadding;
	yMin = yMin - graphPadding;

	const topLeft: XYPosition = {
		x: xMin,
		y: yMin,
	};

	const bottomLeft: XYPosition = {
		x: xMin,
		y: yMax,
	}

	const topRight: XYPosition = {
		x: xMax,
		y: yMin,
	}

	const bottomRight: XYPosition = {
		x: xMax,
		y: yMax,
	}

	const width = Math.abs(topLeft.x - topRight.x);
	const height = Math.abs(topLeft.y - bottomLeft.y);

	const graph: GraphBoundingBox = {
		topLeft,
		bottomLeft,
		topRight,
		bottomRight,
		width,
		height,
		xMax,
		yMax,
		xMin,
		yMin,
	};

	return { nodes, graph };
};
