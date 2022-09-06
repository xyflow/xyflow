import { memo } from 'react';

import { getCenter } from './utils';
import { EdgeSmoothStepProps, Position } from '../../types';
import BaseEdge from './BaseEdge';

// These are some helper methods for drawing the round corners
// The name indicates the direction of the path. "bottomLeftCorner" goes
// from bottom to the left and "leftBottomCorner" goes from left to the bottom.
// We have to consider the direction of the paths because of the animated lines.
const bottomLeftCorner = (x: number, y: number, size: number): string =>
  `L ${x},${y - size}Q ${x},${y} ${x + size},${y}`;
const leftBottomCorner = (x: number, y: number, size: number): string =>
  `L ${x + size},${y}Q ${x},${y} ${x},${y - size}`;
const bottomRightCorner = (x: number, y: number, size: number): string =>
  `L ${x},${y - size}Q ${x},${y} ${x - size},${y}`;
const rightBottomCorner = (x: number, y: number, size: number): string =>
  `L ${x - size},${y}Q ${x},${y} ${x},${y - size}`;
const leftTopCorner = (x: number, y: number, size: number): string => `L ${x + size},${y}Q ${x},${y} ${x},${y + size}`;
const topLeftCorner = (x: number, y: number, size: number): string => `L ${x},${y + size}Q ${x},${y} ${x + size},${y}`;
const topRightCorner = (x: number, y: number, size: number): string => `L ${x},${y + size}Q ${x},${y} ${x - size},${y}`;
const rightTopCorner = (x: number, y: number, size: number): string => `L ${x - size},${y}Q ${x},${y} ${x},${y + size}`;

export interface GetSmoothStepPathParams {
  sourceX: number;
  sourceY: number;
  sourcePosition?: Position;
  targetX: number;
  targetY: number;
  targetPosition?: Position;
  borderRadius?: number;
  centerX?: number;
  centerY?: number;
}

const getPositionDirection = (pos: Position) => {
  switch (pos) {
    case Position.Left:
      return [-1, 0];
    case Position.Right:
      return [1, 0];
    case Position.Top:
      return [0, -1];
    case Position.Bottom:
      return [0, 1];
  }
};

const leftAndRight = [Position.Left, Position.Right];

const getDirection = ({
  sourceX,
  sourceY,
  sourcePosition = Position.Bottom,
  targetX,
  targetY,
}: GetSmoothStepPathParams): XY => {
  if (leftAndRight.includes(sourcePosition)) {
    return sourceX < targetX ? [1, 0] : [-1, 0];
  }

  return sourceY < targetY ? [0, 1] : [0, -1];
};
const offset = 10;

type XY = [number, number];

function getPoints({
  sourceX,
  sourceY,
  sourcePosition = Position.Bottom,
  targetX,
  targetY,
  targetPosition = Position.Top,
  centerX = 1,
  centerY = 1,
}: GetSmoothStepPathParams): XY[] {
  const dir = getDirection({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
  });

  const sourcePoint: XY = [sourceX, sourceY];
  const targetPoint: XY = [targetX, targetY];
  const sourceDir = getPositionDirection(sourcePosition);
  const targetDir = getPositionDirection(targetPosition);
  const dirIndex = dir[0] !== 0 ? 0 : 1;
  const offsetSourcePoint: XY = [sourceX + sourceDir[0] * offset, sourceY + sourceDir[1] * offset];
  const offsetTargetPoint: XY = [targetX + targetDir[0] * offset, targetY + targetDir[1] * offset];
  const currDir = dir[dirIndex];
  // sourceTarget means we take x from source and y from target, targetSource is the opposite
  //  __|
  const sourceTarget: XY[] = [[offsetSourcePoint[0], offsetTargetPoint[1]]];
  // |__
  const targetSource: XY[] = [[offsetTargetPoint[0], offsetSourcePoint[1]]];

  let points: XY[] = [];

  // opposite handle positions, default cases
  if (sourceDir[dirIndex] * targetDir[dirIndex] === -1) {
    //    --->
    //    |
    // >---
    const verticalSplit: XY[] = [
      [centerX, offsetSourcePoint[1]],
      [centerX, offsetTargetPoint[1]],
    ];
    //    |
    //  ---
    //  |
    const horizontalSplit: XY[] = [
      [offsetSourcePoint[0], centerY],
      [offsetTargetPoint[0], centerY],
    ];

    if (currDir === 1) {
      points = dirIndex === 0 ? verticalSplit : horizontalSplit;
    } else {
      points = dirIndex === 0 ? horizontalSplit : verticalSplit;
    }

    // same handle positions
  } else if (sourcePosition === targetPosition) {
    // in this case we only need to split the line in two and draw one corner

    if (dirIndex === 0) {
      points = sourceDir[0] === currDir ? targetSource : sourceTarget;
    } else {
      points = sourceDir[1] === currDir ? sourceTarget : targetSource;
    }
  } else {
    // here the handles are mixed. Right -> Bottom for example

    if (dirIndex === 0) {
      points = sourceDir[0] === currDir ? targetSource : sourceTarget;
    } else {
      points = sourceDir[1] === currDir ? sourceTarget : targetSource;
    }
    const oppoDirIndex = dirIndex === 0 ? 1 : 0;
    if (sourceDir[dirIndex] === 1) {
      if (
        (sourceDir[dirIndex] !== targetDir[oppoDirIndex] &&
          offsetSourcePoint[oppoDirIndex] > offsetTargetPoint[oppoDirIndex]) ||
        (sourceDir[dirIndex] === targetDir[oppoDirIndex] &&
          offsetSourcePoint[oppoDirIndex] < offsetTargetPoint[oppoDirIndex])
      ) {
        points = dirIndex === 0 ? sourceTarget : targetSource;
      }
    } else {
      if (
        (sourceDir[dirIndex] !== targetDir[oppoDirIndex] &&
          offsetSourcePoint[oppoDirIndex] < offsetTargetPoint[oppoDirIndex]) ||
        (sourceDir[dirIndex] === targetDir[oppoDirIndex] &&
          offsetSourcePoint[oppoDirIndex] > offsetTargetPoint[oppoDirIndex])
      ) {
        points = dirIndex === 0 ? sourceTarget : targetSource;
      }
    }
  }

  return [sourcePoint, offsetSourcePoint, ...points, offsetTargetPoint, targetPoint];
}

export function getSmoothStepPath({
  sourceX,
  sourceY,
  sourcePosition = Position.Bottom,
  targetX,
  targetY,
  targetPosition = Position.Top,
  borderRadius = 5,
  centerX,
  centerY,
}: GetSmoothStepPathParams): string {
  const [_centerX, _centerY, offsetX, offsetY] = getCenter({ sourceX, sourceY, targetX, targetY });
  const cornerWidth = Math.min(borderRadius, Math.abs(targetX - sourceX));
  const cornerHeight = Math.min(borderRadius, Math.abs(targetY - sourceY));
  const cornerSize = Math.min(cornerWidth, cornerHeight, offsetX, offsetY);
  const cX = typeof centerX !== 'undefined' ? centerX : _centerX;
  const cY = typeof centerY !== 'undefined' ? centerY : _centerY;

  const points = getPoints({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    centerX: cX,
    centerY: cY,
  });

  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]} ${p[1]}`).join(' ');
}

const SmoothStepEdge = memo(
  ({
    sourceX,
    sourceY,
    targetX,
    targetY,
    label,
    labelStyle,
    labelShowBg,
    labelBgStyle,
    labelBgPadding,
    labelBgBorderRadius,
    style,
    sourcePosition = Position.Bottom,
    targetPosition = Position.Top,
    markerEnd,
    markerStart,
    borderRadius = 5,
  }: EdgeSmoothStepProps) => {
    const [centerX, centerY] = getCenter({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });

    const path = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius,
    });

    return (
      <BaseEdge
        path={path}
        centerX={centerX}
        centerY={centerY}
        label={label}
        labelStyle={labelStyle}
        labelShowBg={labelShowBg}
        labelBgStyle={labelBgStyle}
        labelBgPadding={labelBgPadding}
        labelBgBorderRadius={labelBgBorderRadius}
        style={style}
        markerEnd={markerEnd}
        markerStart={markerStart}
      />
    );
  }
);

SmoothStepEdge.displayName = 'SmoothStepEdge';

export default SmoothStepEdge;
