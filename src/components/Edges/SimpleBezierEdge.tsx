import React, { memo } from 'react';
import { EdgeProps, Position } from '../../types';
import BaseEdge from './BaseEdge';

export interface GetSimpleBezierPathParams {
  sourceX: number;
  sourceY: number;
  sourcePosition?: Position;
  targetX: number;
  targetY: number;
  targetPosition?: Position;
}

interface GetControlParams {
  pos: Position;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function getControl({ pos, x1, y1, x2, y2 }: GetControlParams): [number, number] {
  let ctX: number, ctY: number;
  switch (pos) {
    case Position.Left:
    case Position.Right:
      {
        ctX = 0.5 * (x1 + x2);
        ctY = y1;
      }
      break;
    case Position.Top:
    case Position.Bottom:
      {
        ctX = x1;
        ctY = 0.5 * (y1 + y2);
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
}: GetSimpleBezierPathParams): string {
  const [sourceControlX, sourceControlY] = getControl({
    pos: sourcePosition,
    x1: sourceX,
    y1: sourceY,
    x2: targetX,
    y2: targetY,
  });
  const [targetControlX, targetControlY] = getControl({
    pos: targetPosition,
    x1: targetX,
    y1: targetY,
    x2: sourceX,
    y2: sourceY,
  });
  return `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`;
}

// @TODO: this function will recalculate the control points
// one option is to let getXXXPath() return center points
// but will introduce breaking changes
// the getCenter() of other types of edges might need to change, too
export function getSimpleBezierCenter({
  sourceX,
  sourceY,
  sourcePosition = Position.Bottom,
  targetX,
  targetY,
  targetPosition = Position.Top,
}: GetSimpleBezierPathParams): [number, number, number, number] {
  const [sourceControlX, sourceControlY] = getControl({
    pos: sourcePosition,
    x1: sourceX,
    y1: sourceY,
    x2: targetX,
    y2: targetY,
  });
  const [targetControlX, targetControlY] = getControl({
    pos: targetPosition,
    x1: targetX,
    y1: targetY,
    x2: sourceX,
    y2: sourceY,
  });
  // cubic bezier t=0.5 mid point, not the actual mid point, but easy to calculate
  // https://stackoverflow.com/questions/67516101/how-to-find-distance-mid-point-of-bezier-curve
  const centerX = sourceX * 0.125 + sourceControlX * 0.375 + targetControlX * 0.375 + targetX * 0.125;
  const centerY = sourceY * 0.125 + sourceControlY * 0.375 + targetControlY * 0.375 + targetY * 0.125;
  const xOffset = Math.abs(centerX - sourceX);
  const yOffset = Math.abs(centerY - sourceY);
  return [centerX, centerY, xOffset, yOffset];
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
    const params = {
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    };
    const path = getSimpleBezierPath(params);
    const [centerX, centerY] = getSimpleBezierCenter(params);

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
