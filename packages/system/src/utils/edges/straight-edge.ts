import { getEdgeCenter } from './general';

export type GetStraightPathParams = {
  /** The `x` position of the source handle. */
  sourceX: number;
  /** The `y` position of the source handle. */
  sourceY: number;
  /** The `x` position of the target handle. */
  targetX: number;
  /** The `y` position of the target handle. */
  targetY: number;
};

/**
 * Calculates the straight line path between two points.
 * @public
 * @returns A path string you can use in an SVG, the `labelX` and `labelY` position (center of path)
 * and `offsetX`, `offsetY` between source handle and label.
 *
 * - `path`: the path to use in an SVG `<path>` element.
 * - `labelX`: the `x` position you can use to render a label for this edge.
 * - `labelY`: the `y` position you can use to render a label for this edge.
 * - `offsetX`: the absolute difference between the source `x` position and the `x` position of the
 * middle of this path.
 * - `offsetY`: the absolute difference between the source `y` position and the `y` position of the
 * middle of this path.
 * @example
 * ```js
 *  const source = { x: 0, y: 20 };
 *  const target = { x: 150, y: 100 };
 *
 *  const [path, labelX, labelY, offsetX, offsetY] = getStraightPath({
 *    sourceX: source.x,
 *    sourceY: source.y,
 *    sourcePosition: Position.Right,
 *    targetX: target.x,
 *    targetY: target.y,
 *    targetPosition: Position.Left,
 *  });
 * ```
 * @remarks This function returns a tuple (aka a fixed-size array) to make it easier to work with multiple edge paths at once.
 */
export function getStraightPath({
  sourceX,
  sourceY,
  targetX,
  targetY,
}: GetStraightPathParams): [path: string, labelX: number, labelY: number, offsetX: number, offsetY: number] {
  const [labelX, labelY, offsetX, offsetY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return [`M ${sourceX},${sourceY}L ${targetX},${targetY}`, labelX, labelY, offsetX, offsetY];
}
