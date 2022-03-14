import React, { memo } from 'react';

import BaseEdge from './BaseEdge';
import { getCenter } from './utils';
import { EdgeProps, Position } from '../../types';

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
  curvature = 0.5,
  centerX,
  centerY,
}: GetBezierPathParams): string {
  const leftAndRight = [Position.Left, Position.Right];
  const hasCurvature = curvature > 0;
  let cX,
    cY = 0;

  if (!hasCurvature) {
    const [_centerX, _centerY] = getCenter({ sourceX, sourceY, targetX, targetY });
    cX = typeof centerX !== 'undefined' ? centerX : _centerX;
    cY = typeof centerY !== 'undefined' ? centerY : _centerY;
  }

  const distanceX = sourceX - targetX;
  const distanceY = sourceY - targetY;

  // A scalar value to fix the curve size getting larger
  const scalarX = Math.min(curvature, Math.max(0, distanceX / 10000));
  const scalarY = Math.min(curvature, Math.max(0, distanceY / 10000));

  const hx1 = sourceX + Math.abs(targetX - sourceX) * (curvature - scalarX);
  const hx2 = targetX - Math.abs(targetX - sourceX) * (curvature - scalarX);

  const hy1 = sourceY + Math.abs(targetY - sourceY) * (curvature - scalarY);
  const hy2 = targetY - Math.abs(targetY - sourceY) * (curvature - scalarY);

  let path = hasCurvature
    ? `M${sourceX},${sourceY} C${sourceX},${hy1} ${targetX},${hy2} ${targetX},${targetY}`
    : `M${sourceX},${sourceY} C${sourceX},${cY} ${targetX},${cY} ${targetX},${targetY}`;

  if (leftAndRight.includes(sourcePosition) && leftAndRight.includes(targetPosition)) {
    path = hasCurvature
      ? `M${sourceX},${sourceY} C${hx1},${sourceY} ${hx2},${targetY}, ${targetX},${targetY}`
      : `M${sourceX},${sourceY} C${cX},${sourceY} ${cX},${targetY} ${targetX},${targetY}`;
  } else if (leftAndRight.includes(targetPosition)) {
    path = `M${sourceX},${sourceY} Q${sourceX},${targetY} ${targetX},${targetY}`;
  } else if (leftAndRight.includes(sourcePosition)) {
    path = `M${sourceX},${sourceY} Q${targetX},${sourceY} ${targetX},${targetY}`;
  }

  return path;
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
