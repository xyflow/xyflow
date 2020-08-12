import React, { memo } from 'react';

import EdgeText from './EdgeText';
import { getMarkerEnd, getCenter } from './utils';
import { EdgeSmoothStepProps, Position } from '../../types';

// These are some helper methods for drawing the round corners
// The name indicates the direction of the path. "bottomLeftCorner" goes
// from bottom to the left and "leftBottomCorner" goes from left to the bottom.
// We have to consider the direction of the paths because of the animated lines.

const bottomLeftCorner = (cornerX: number, cornerY: number, cornerSize: number): string =>
  `L ${cornerX},${cornerY - cornerSize}Q ${cornerX},${cornerY} ${cornerX + cornerSize},${cornerY}`;

const leftBottomCorner = (cornerX: number, cornerY: number, cornerSize: number): string =>
  `L ${cornerX + cornerSize},${cornerY}Q ${cornerX},${cornerY} ${cornerX},${cornerY - cornerSize}`;

const bottomRightCorner = (cornerX: number, cornerY: number, cornerSize: number): string =>
  `L ${cornerX},${cornerY - cornerSize}Q ${cornerX},${cornerY} ${cornerX - cornerSize},${cornerY}`;

const rightBottomCorner = (cornerX: number, cornerY: number, cornerSize: number): string =>
  `L ${cornerX - cornerSize},${cornerY}Q ${cornerX},${cornerY} ${cornerX},${cornerY - cornerSize}`;

const leftTopCorner = (cornerX: number, cornerY: number, cornerSize: number): string =>
  `L ${cornerX + cornerSize},${cornerY}Q ${cornerX},${cornerY} ${cornerX},${cornerY + cornerSize}`;

const topLeftCorner = (cornerX: number, cornerY: number, cornerSize: number): string =>
  `L ${cornerX},${cornerY + cornerSize}Q ${cornerX},${cornerY} ${cornerX + cornerSize},${cornerY}`;

const topRightCorner = (cornerX: number, cornerY: number, cornerSize: number): string =>
  `L ${cornerX},${cornerY + cornerSize}Q ${cornerX},${cornerY} ${cornerX - cornerSize},${cornerY}`;

const rightTopCorner = (cornerX: number, cornerY: number, cornerSize: number): string =>
  `L ${cornerX - cornerSize},${cornerY}Q ${cornerX},${cornerY} ${cornerX},${cornerY + cornerSize}`;

interface GetSmoothStepPathParams {
  sourceX: number;
  sourceY: number;
  sourcePosition?: Position;
  targetX: number;
  targetY: number;
  targetPosition?: Position;
  borderRadius?: number;
}

export function getSmoothStepPath({
  sourceX,
  sourceY,
  sourcePosition = Position.Bottom,
  targetX,
  targetY,
  targetPosition = Position.Top,
  borderRadius = 5,
}: GetSmoothStepPathParams): string {
  const [centerX, centerY, offsetX, offsetY] = getCenter({ sourceX, sourceY, targetX, targetY });
  const cornerWidth = Math.min(borderRadius, Math.abs(targetX - sourceX));
  const cornerHeight = Math.min(borderRadius, Math.abs(targetY - sourceY));
  const cornerSize = Math.min(cornerWidth, cornerHeight, offsetX, offsetY);

  const leftAndRight = [Position.Left, Position.Right];

  let firstCornerPath = null;
  let secondCornerPath = null;

  // default case: source and target positions are top or bottom
  if (sourceX <= targetX) {
    firstCornerPath =
      sourceY <= targetY ? bottomLeftCorner(sourceX, centerY, cornerSize) : topLeftCorner(sourceX, centerY, cornerSize);
    secondCornerPath =
      sourceY <= targetY
        ? rightTopCorner(targetX, centerY, cornerSize)
        : rightBottomCorner(targetX, centerY, cornerSize);
  } else {
    firstCornerPath =
      sourceY < targetY
        ? bottomRightCorner(sourceX, centerY, cornerSize)
        : topRightCorner(sourceX, centerY, cornerSize);
    secondCornerPath =
      sourceY < targetY ? leftTopCorner(targetX, centerY, cornerSize) : leftBottomCorner(targetX, centerY, cornerSize);
  }

  if (leftAndRight.includes(sourcePosition) && leftAndRight.includes(targetPosition)) {
    if (sourceX <= targetX) {
      firstCornerPath =
        sourceY <= targetY
          ? rightTopCorner(centerX, sourceY, cornerSize)
          : rightBottomCorner(centerX, sourceY, cornerSize);
      secondCornerPath =
        sourceY <= targetY
          ? bottomLeftCorner(centerX, targetY, cornerSize)
          : topLeftCorner(centerX, targetY, cornerSize);
    }
  } else if (leftAndRight.includes(sourcePosition) && !leftAndRight.includes(targetPosition)) {
    if (sourceX <= targetX) {
      firstCornerPath =
        sourceY <= targetY
          ? rightTopCorner(targetX, sourceY, cornerSize)
          : rightBottomCorner(targetX, sourceY, cornerSize);
    } else {
      firstCornerPath =
        sourceY <= targetY
          ? bottomRightCorner(sourceX, targetY, cornerSize)
          : topRightCorner(sourceX, targetY, cornerSize);
    }
    secondCornerPath = '';
  } else if (!leftAndRight.includes(sourcePosition) && leftAndRight.includes(targetPosition)) {
    if (sourceX <= targetX) {
      firstCornerPath =
        sourceY <= targetY
          ? bottomLeftCorner(sourceX, targetY, cornerSize)
          : topLeftCorner(sourceX, targetY, cornerSize);
    } else {
      firstCornerPath =
        sourceY <= targetY
          ? bottomRightCorner(sourceX, targetY, cornerSize)
          : topRightCorner(sourceX, targetY, cornerSize);
    }
    secondCornerPath = '';
  }

  return `M ${sourceX},${sourceY}${firstCornerPath}${secondCornerPath}L ${targetX},${targetY}`;
}

export default memo(
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
    arrowHeadType,
    markerEndId,
    borderRadius = 5,
  }: EdgeSmoothStepProps) => {
    const [centerX, centerY] = getCenter({ sourceX, sourceY, targetX, targetY });

    const path = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius,
    });

    const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);

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

    return (
      <>
        <path style={style} className="react-flow__edge-path" d={path} markerEnd={markerEnd} />
        {text}
      </>
    );
  }
);
