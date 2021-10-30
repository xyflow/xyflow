import type { Grid } from 'pathfinding';
import type { Position, XYPosition } from '../../../types';

type Direction = 'top' | 'bottom' | 'left' | 'right';

export const getNextPointFromPosition = (
	point: XYPosition,
	position: Direction,
): XYPosition => {
	switch (position) {
		case 'top':
			return { x: point.x, y: point.y - 1 };
		case 'bottom':
			return { x: point.x, y: point.y + 1 };
		case 'left':
			return { x: point.x - 1, y: point.y };
		case 'right':
			return { x: point.x + 1, y: point.y };
	}
};

/**
 * Guarantee that the path is walkable, even if the point is inside a non
 * walkable area, by adding a walkable path in the direction of the point's
 * Position.
 */
export const guaranteeWalkablePath = (
	grid: Grid,
	point: XYPosition,
	position: Position,
) => {
	let node = grid.getNodeAt(point.x, point.y);
	while (!node.walkable) {
		grid.setWalkableAt(node.x, node.y, true);
		const next = getNextPointFromPosition(node, position);
		node = grid.getNodeAt(next.x, next.y);
	}
};
