import { memo } from 'react';

import { getCenter } from './utils';
import { EdgeSmoothStepProps, Position, XYPosition } from '../../types';
import BaseEdge from './BaseEdge';

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
  offset?: number;
}

const handleDirections = {
  [Position.Left]: { x: -1, y: 0 },
  [Position.Right]: { x: 1, y: 0 },
  [Position.Top]: { x: 0, y: -1 },
  [Position.Bottom]: { x: 0, y: 1 },
};

const getDirection = ({
  source,
  sourcePosition = Position.Bottom,
  target,
}: {
  source: XYPosition;
  sourcePosition: Position;
  target: XYPosition;
}): XYPosition => {
  if (sourcePosition === Position.Left || sourcePosition === Position.Right) {
    return source.x < target.x ? { x: 1, y: 0 } : { x: -1, y: 0 };
  }

  return source.y < target.y ? { x: 0, y: 1 } : { x: 0, y: -1 };
};

const distance = (a: XYPosition, b: XYPosition) => Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));

// ith this function we try to mimic a orthogonal edge routing behaviour
// It's not as good as a real orthogonal edge routing but it's faster and good enough as a default for step and smooth step edges
function getPoints({
  source,
  sourcePosition = Position.Bottom,
  target,
  targetPosition = Position.Top,
  center,
  offset,
}: {
  source: XYPosition;
  sourcePosition: Position;
  target: XYPosition;
  targetPosition: Position;
  center: XYPosition;
  offset: number;
}): XYPosition[] {
  const sourceDir = handleDirections[sourcePosition];
  const targetDir = handleDirections[targetPosition];
  const sourceGapped: XYPosition = { x: source.x + sourceDir.x * offset, y: source.y + sourceDir.y * offset };
  const targetGapped: XYPosition = { x: target.x + targetDir.x * offset, y: target.y + targetDir.y * offset };
  const dir = getDirection({
    source: sourceGapped,
    sourcePosition,
    target: targetGapped,
  });
  const dirAccessor = dir.x !== 0 ? 'x' : 'y';
  const currDir = dir[dirAccessor];
  // sourceTarget means we take x from source and y from target, targetSource is the opposite
  const sourceTarget: XYPosition[] = [{ x: sourceGapped.x, y: targetGapped.y }];
  const targetSource: XYPosition[] = [{ x: targetGapped.x, y: sourceGapped.y }];

  let points: XYPosition[] = [];

  // opposite handle positions, default case
  if (sourceDir[dirAccessor] * targetDir[dirAccessor] === -1) {
    //    --->
    //    |
    // >---
    const verticalSplit: XYPosition[] = [
      { x: center.x, y: sourceGapped.y },
      { x: center.x, y: targetGapped.y },
    ];
    //    |
    //  ---
    //  |
    const horizontalSplit: XYPosition[] = [
      { x: sourceGapped.x, y: center.y },
      { x: targetGapped.x, y: center.y },
    ];

    if (currDir === 1) {
      if (sourceDir[dirAccessor] === 1) {
        points = dirAccessor === 'x' ? verticalSplit : horizontalSplit;
      } else {
        points = dirAccessor === 'x' ? horizontalSplit : verticalSplit;
      }
    } else {
      if (sourceDir[dirAccessor] === 1) {
        points = dirAccessor === 'x' ? horizontalSplit : verticalSplit;
      } else {
        points = dirAccessor === 'x' ? verticalSplit : horizontalSplit;
      }
    }
  } else {
    // here we handle edges with same handle positions and mixed positions like Right -> Bottom for example
    if (dirAccessor === 'x') {
      points = sourceDir.x === currDir ? targetSource : sourceTarget;
    } else {
      points = sourceDir.y === currDir ? sourceTarget : targetSource;
    }

    if (sourcePosition !== targetPosition) {
      const oppositeDirAccessor = dirAccessor === 'x' ? 'y' : 'x';
      const oppositeDir = sourceDir[dirAccessor] !== targetDir[oppositeDirAccessor];
      const sameDir = sourceDir[dirAccessor] === targetDir[oppositeDirAccessor];
      const sourceGtTargetOppo = sourceGapped[oppositeDirAccessor] > targetGapped[oppositeDirAccessor];
      const sourceLtTargetOppo = sourceGapped[oppositeDirAccessor] < targetGapped[oppositeDirAccessor];
      if (sourceDir[dirAccessor] === 1) {
        if ((oppositeDir && sourceGtTargetOppo) || (sameDir && sourceLtTargetOppo)) {
          points = dirAccessor === 'x' ? sourceTarget : targetSource;
        }
      } else {
        if ((oppositeDir && sourceLtTargetOppo) || (sameDir && sourceGtTargetOppo)) {
          points = dirAccessor === 'x' ? sourceTarget : targetSource;
        }
      }
    }
  }

  return [source, sourceGapped, ...points, targetGapped, target];
}

function getBend(a: XYPosition, b: XYPosition, c: XYPosition, size: number): string {
  const seg1Horizontal = a.y === b.y;
  const { x, y } = b;
  const bendSize = Math.min(distance(a, b) / 2, distance(b, c) / 2, size);

  // no bend
  if ((a.x === x && x === c.x) || (a.y === y && y === c.y)) {
    return `L${x} ${y}`;
  }

  if (seg1Horizontal) {
    const xDir = a.x < c.x ? -1 : 1;
    const yDir = a.y < c.y ? 1 : -1;
    return `L ${x + bendSize * xDir},${y}Q ${x},${y} ${x},${y + bendSize * yDir}`;
  }

  const xDir = a.x < c.x ? 1 : -1;
  const yDir = a.y < c.y ? -1 : 1;
  return `L ${x},${y + bendSize * yDir}Q ${x},${y} ${x + bendSize * xDir},${y}`;
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
  offset = 20,
}: GetSmoothStepPathParams): string {
  const [_centerX, _centerY] = getCenter({ sourceX, sourceY, targetX, targetY });
  const cX = typeof centerX !== 'undefined' ? centerX : _centerX;
  const cY = typeof centerY !== 'undefined' ? centerY : _centerY;

  const points = getPoints({
    source: { x: sourceX, y: sourceY },
    sourcePosition,
    target: { x: targetX, y: targetY },
    targetPosition,
    center: { x: cX, y: cY },
    offset,
  });

  return points.reduce<string>((res, p, i) => {
    let segment = '';

    if (i > 0 && i < points.length - 1) {
      segment = getBend(points[i - 1], p, points[i + 1], borderRadius);
    } else {
      segment = `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`;
    }

    res += segment;

    return res;
  }, '');
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
    offset = 20,
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
      offset,
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
