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
  let cX,
    cY = 0;

  const [_centerX, _centerY] = getCenter({ sourceX, sourceY, targetX, targetY });

  if (leftAndRight.includes(sourcePosition) && leftAndRight.includes(targetPosition)) {
    cX = typeof centerX !== 'undefined' ? centerX : _centerX;
    const distanceX = targetX - sourceX;
    const absDistanceX = Math.abs(Math.min(0, distanceX));
    const amtX = (Math.sqrt(absDistanceX) / 2) * (50 * curvature);

    const hx1 = hasCurvature && distanceX < 0 ? sourceX + amtX : cX;
    const hx2 = hasCurvature && distanceX < 0 ? targetX - amtX : cX;

    return `M${sourceX},${sourceY} C${hx1},${sourceY} ${hx2},${targetY}, ${targetX},${targetY}`;
  } else if (leftAndRight.includes(targetPosition)) {
    return `M${sourceX},${sourceY} Q${sourceX},${targetY} ${targetX},${targetY}`;
  } else if (leftAndRight.includes(sourcePosition)) {
    return `M${sourceX},${sourceY} Q${targetX},${sourceY} ${targetX},${targetY}`;
  }

  cY = typeof centerY !== 'undefined' ? centerY : _centerY;
  const distanceY = targetY - sourceY;

  const absDistanceY = Math.abs(Math.min(0, distanceY));
  const amtY = (Math.sqrt(absDistanceY) / 2) * (50 * curvature);

  const hy1 = hasCurvature && distanceY < 0 ? sourceY + amtY : cY;
  const hy2 = hasCurvature && distanceY < 0 ? targetY - amtY : cY;

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
