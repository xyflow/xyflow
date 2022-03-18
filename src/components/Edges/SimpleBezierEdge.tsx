import React, { memo } from 'react';
import { EdgeProps, Position } from '../../types';
import BaseEdge from './BaseEdge';
import { getCenter } from './utils';

export interface GetSimpleBezierPathParams {
  sourceX: number;
  sourceY: number;
  sourcePosition?: Position;
  targetX: number;
  targetY: number;
  targetPosition?: Position;
  centerX?: number;
  centerY?: number;
}

interface GetControlParams {
  pos: Position;
  x: number;
  y: number;
  cX: number;
  cY: number;
}

function getControl({ pos, x, y, cX, cY }: GetControlParams): [number, number] {
  let ctX: number, ctY: number;
  switch (pos) {
    case Position.Left:
    case Position.Right:
      {
        ctX = cX;
        ctY = y;
      }
      break;
    case Position.Top:
    case Position.Bottom:
      {
        ctX = x;
        ctY = cY;
      }
      break;
  }
  return [ctX, ctY];
}

export function getSimpleBezierPath({
  sourceX,
  sourceY,
  sourcePosition = Position.Bottom,
  targetX,
  targetY,
  targetPosition = Position.Top,
  centerX,
  centerY,
}: GetSimpleBezierPathParams): string {
  const [_centerX, _centerY] = getCenter({ sourceX, sourceY, targetX, targetY });
  centerX = centerX ?? _centerX;
  centerY = centerY ?? _centerY;
  const [sourceControlX, sourceControlY] = getControl({
    pos: sourcePosition,
    x: sourceX,
    y: sourceY,
    cX: centerX,
    cY: centerY,
  });
  const [targetControlX, targetControlY] = getControl({
    pos: targetPosition,
    x: targetX,
    y: targetY,
    cX: centerX,
    cY: centerY,
  });
  return `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`;
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
  }: EdgeProps) => {
    const [centerX, centerY] = getCenter({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });
    const path = getSimpleBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
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
