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

  const inverted = sourcePosition === Position.Left || sourcePosition === Position.Top
  const _targetX = inverted ? sourceX : targetX;
  const _targetY  = inverted ? sourceY : targetY;
  const _sourceX = inverted ? targetX : sourceX;
  const _sourceY = inverted ? targetY : sourceY;

  const hasCurvature = curvature > 0;
  let cX,
    cY = 0;

  const [_centerX, _centerY] = getCenter({ sourceX: _sourceX, sourceY: _sourceY, targetX: _targetX, targetY: _targetY });

  if (leftAndRight.includes(sourcePosition) && leftAndRight.includes(targetPosition)) {
    cX = typeof centerX !== 'undefined' ? centerX : _centerX;
    const distanceX = _targetX - _sourceX;
    const absDistanceX = Math.abs(Math.min(0, distanceX));
    const amtX = (Math.sqrt(absDistanceX) / 2) * (50 * curvature);

    const hx1 = hasCurvature && distanceX < 0 ? _sourceX + amtX : cX;
    const hx2 = hasCurvature && distanceX < 0 ? _targetX - amtX : cX;

    return `M${_sourceX},${_sourceY} C${hx1},${_sourceY} ${hx2},${_targetY}, ${_targetX},${_targetY}`;
  } else if (leftAndRight.includes(targetPosition)) {
    return `M${_sourceX},${_sourceY} Q${_sourceX},${_targetY} ${_targetX},${_targetY}`;
  } else if (leftAndRight.includes(sourcePosition)) {
    return `M${_sourceX},${_sourceY} Q${_targetX},${_sourceY} ${_targetX},${_targetY}`;
  }

  cY = typeof centerY !== 'undefined' ? centerY : _centerY;
  const distanceY = _targetY - _sourceY;

  const absDistanceY = Math.abs(Math.min(0, distanceY));
  const amtY = (Math.sqrt(absDistanceY) / 2) * (50 * curvature);

  const hy1 = hasCurvature && distanceY < 0 ? _sourceY + amtY : cY;
  const hy2 = hasCurvature && distanceY < 0 ? _targetY - amtY : cY;

  return `M${_sourceX},${_sourceY} C${_sourceX},${hy1} ${_targetX},${hy2} ${_targetX},${_targetY}`;
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
