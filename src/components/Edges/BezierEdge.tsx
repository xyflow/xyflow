import React, { memo } from 'react';
import { EdgeProps, Position } from '../../types';
import BaseEdge from './BaseEdge';
import { getCenter } from './utils';

export interface GetBezierPathParams {
  sourceX: number;
  sourceY: number;
  sourcePosition?: Position;
  targetX: number;
  targetY: number;
  targetPosition?: Position;
  curvature?: number;
  centerX?: number;
  centerY?: number;
}

// @TODO: refactor getBezierPath function. It's too long and hard to understand.
// We should reuse the curvature handling for top/bottom and left/right.
export function getBezierPath({
  sourceX,
  sourceY,
  sourcePosition = Position.Bottom,
  targetX,
  targetY,
  targetPosition = Position.Top,
  curvature = 0.25,
  centerX,
  centerY,
}: GetBezierPathParams): string {
  const leftAndRight = [Position.Left, Position.Right];
  const hasCurvature = curvature > 0;
  const [_centerX, _centerY] = getCenter({ sourceX, sourceY, targetX, targetY });

  if (leftAndRight.includes(sourcePosition) && leftAndRight.includes(targetPosition)) {
    const cX = typeof centerX !== 'undefined' ? centerX : _centerX;
    const distanceX = targetX - sourceX;
    const absDistanceX = Math.abs(distanceX);
    const amtX = (Math.sqrt(absDistanceX) / 2) * (50 * curvature);

    let hx1 = cX;
    let hx2 = cX;

    if (hasCurvature) {
      const sourceAndTargetRight = sourcePosition === Position.Right && targetPosition === Position.Right;
      const sourceAndTargetLeft = sourcePosition === Position.Left && targetPosition === Position.Left;

      hx1 = sourceX + amtX;
      hx2 = targetX - amtX;

      if (sourceAndTargetLeft) {
        hx1 = sourceX - amtX;
      } else if (sourceAndTargetRight) {
        hx2 = targetX + amtX;
      } else if (sourcePosition === Position.Left && targetX <= sourceX) {
        hx1 = cX;
        hx2 = cX;
      } else if (sourcePosition === Position.Left && targetX > sourceX) {
        hx1 = sourceX - amtX;
        hx2 = targetX + amtX;
      }
    }

    return `M${sourceX},${sourceY} C${hx1},${sourceY} ${hx2},${targetY}, ${targetX},${targetY}`;
  } else if (leftAndRight.includes(targetPosition)) {
    return `M${sourceX},${sourceY} Q${sourceX},${targetY} ${targetX},${targetY}`;
  } else if (leftAndRight.includes(sourcePosition)) {
    return `M${sourceX},${sourceY} Q${targetX},${sourceY} ${targetX},${targetY}`;
  }

  const cY = typeof centerY !== 'undefined' ? centerY : _centerY;
  const distanceY = targetY - sourceY;
  const absDistanceY = Math.abs(distanceY);
  const amtY = (Math.sqrt(absDistanceY) / 2) * (50 * curvature);

  let hy1 = cY;
  let hy2 = cY;

  if (hasCurvature) {
    hy1 = sourceY + amtY;
    hy2 = targetY - amtY;

    const sourceAndTargetTop = sourcePosition === Position.Top && targetPosition === Position.Top;
    const sourceAndTargetBottom = sourcePosition === Position.Bottom && targetPosition === Position.Bottom;

    if (sourceAndTargetTop) {
      hy1 = targetY - amtY;
    } else if (sourceAndTargetBottom) {
      hy2 = targetY + amtY;
    } else if (sourcePosition === Position.Top && targetY <= sourceY) {
      hy1 = cY;
      hy2 = cY;
    } else if (sourcePosition === Position.Top && targetY > sourceY) {
      hy1 = sourceY - amtY;
      hy2 = targetY + amtY;
    }
  }

  return `M${sourceX},${sourceY} C${sourceX},${hy1} ${targetX},${hy2} ${targetX},${targetY}`;
}

export default memo(
  ({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition = Position.Bottom,
    targetPosition = Position.Top,
    label,
    labelStyle,
    labelShowBg,
    labelBgStyle,
    labelBgPadding,
    labelBgBorderRadius,
    style,
    markerEnd,
    markerStart,
    curvature,
  }: EdgeProps) => {
    const [centerX, centerY] = getCenter({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });
    const path = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      curvature,
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
