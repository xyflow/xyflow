import React, { memo } from 'react';

import EdgeText from './EdgeText';

import { getMarkerEnd, getCenter } from './utils';
import { EdgeProps, Position, XYPosition } from '../../types';

interface GetBezierPathParams {
  sourceX: number;
  sourceY: number;
  sourcePosition?: Position;
  targetX: number;
  targetY: number;
  targetPosition?: Position;
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
}: GetBezierPathParams): string {
  const endOfSourceRunway = getRunwayPoint(sourceX, sourceY, sourcePosition);
  const startOfTargetRunway = getRunwayPoint(targetX, targetY, targetPosition);
  return `M ${sourceX},${sourceY} C ${endOfSourceRunway.x},${endOfSourceRunway.y} ${startOfTargetRunway.x},${startOfTargetRunway.y} ${targetX},${targetY}`;
}

const RUNWAY_DISTANCE = 50;
const getRunwayPoint = (x: number, y: number, position: Position): XYPosition => {
  switch (position) {
    case Position.Top:
      return { x, y: y - RUNWAY_DISTANCE };
    case Position.Right:
      return { x: x + RUNWAY_DISTANCE, y };
    case Position.Bottom:
      return { x, y: y + RUNWAY_DISTANCE };
    case Position.Left:
      return { x: x - RUNWAY_DISTANCE, y };
  }
};

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
    arrowHeadType,
    markerEndId,
  }: EdgeProps) => {
    const [centerX, centerY] = getCenter({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });
    const path = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    const text = label ? (
      <EdgeText
        x={centerX}
        y={centerY}
        label={label}
        labelStyle={labelStyle}
        labelShowBg={labelShowBg}
        labelBgStyle={labelBgStyle}
        labelBgPadding={labelBgPadding}
        labelBgBorderRadius={labelBgBorderRadius}
      />
    ) : null;

    const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);

    return (
      <>
        <path style={style} d={path} className="react-flow__edge-path" markerEnd={markerEnd} />
        {text}
      </>
    );
  }
);
