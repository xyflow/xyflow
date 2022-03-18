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

interface GetControlWithCurvatureParams {
  pos: Position;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  cX: number;
  cY: number;
  c: number;
}

function calculateControlOffset(distance: number, curvature: number): number {
  return curvature * 25 * Math.sqrt(distance);
}

function getControlWithCurvature({ pos, x1, y1, x2, y2, cX, cY, c }: GetControlWithCurvatureParams): [number, number] {
  let ctX: number, ctY: number;
  switch (pos) {
    case Position.Left:
      {
        const d = x2 - x1;
        ctY = y1;
        if (d <= 0) {
          ctX = cX;
        } else {
          ctX = x1 - calculateControlOffset(d, c);
        }
      }
      break;
    case Position.Right:
      {
        const d = x1 - x2;
        ctY = y1;
        if (d <= 0) {
          ctX = cX;
        } else {
          ctX = x1 + calculateControlOffset(d, c);
        }
      }
      break;
    case Position.Top:
      {
        const d = y2 - y1;
        ctX = x1;
        if (d <= 0) {
          ctY = cY;
        } else {
          ctY = y1 - calculateControlOffset(d, c);
        }
      }
      break;
    case Position.Bottom:
      {
        const d = y1 - y2;
        ctX = x1;
        if (d <= 0) {
          ctY = cY;
        } else {
          ctY = y1 + calculateControlOffset(d, c);
        }
      }
      break;
  }
  return [ctX, ctY];
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
  const [_centerX, _centerY] = getCenter({ sourceX, sourceY, targetX, targetY });
  centerX = centerX ?? _centerX;
  centerY = centerY ?? _centerY;
  const [sourceControlX, sourceControlY] = getControlWithCurvature({
    pos: sourcePosition,
    x1: sourceX,
    y1: sourceY,
    x2: targetX,
    y2: targetY,
    cX: centerX,
    cY: centerY,
    c: curvature,
  });
  const [targetControlX, targetControlY] = getControlWithCurvature({
    pos: targetPosition,
    x1: targetX,
    y1: targetY,
    x2: sourceX,
    y2: sourceY,
    cX: centerX,
    cY: centerY,
    c: curvature,
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
