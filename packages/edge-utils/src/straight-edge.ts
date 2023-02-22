import { getEdgeCenter } from './general';

export type GetStraightPathParams = {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
};

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
