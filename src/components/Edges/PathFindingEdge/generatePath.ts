import { AStarFinder, Util, DiagonalMovement } from 'pathfinding';
import type { Grid } from 'pathfinding';
import type { XYPosition } from '../../../types';

// https://www.npmjs.com/package/pathfinding#advanced-usage
declare module 'pathfinding' {
	interface FinderOptions extends Heuristic {
		diagonalMovement?: DiagonalMovement;
		weight?: number;
		allowDiagonal?: boolean;
		dontCrossCorners?: boolean;
	}
}

export const generatePath = (
	grid: Grid,
	start: XYPosition,
	end: XYPosition,
): number[][] => {
	const finder = new AStarFinder({
		diagonalMovement: DiagonalMovement.Always,
		allowDiagonal: true,
		dontCrossCorners: true,
	});

	let path: number[][] = [];

	try {
		path = finder.findPath(start.x, start.y, end.x, end.y, grid);
		path = Util.smoothenPath(grid, path);
	} catch {
		// No path was found. This can happen if the end point is "surrounded"
		// by other nodes, or if the starting and ending nodes are on top of
		// each other.
	}

	return path;
};
