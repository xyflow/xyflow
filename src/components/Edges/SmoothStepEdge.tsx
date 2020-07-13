import React, { memo } from 'react';

import EdgeText from './EdgeText';
import { EdgeBezierProps, Position } from '../../types';

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
    style,
    sourcePosition = Position.Bottom,
    targetPosition = Position.Top,
  }: EdgeBezierProps) => {
    const yOffset = Math.abs(targetY - sourceY) / 2;
    const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;

    const xOffset = Math.abs(targetX - sourceX) / 2;
    const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;

    const cornerWidth = Math.min(5, Math.abs(targetX - sourceX));
    const cornerHeight = Math.min(5, Math.abs(targetY - sourceY));
    const cornerSize = Math.min(cornerWidth, cornerHeight, xOffset, yOffset);

    const leftAndRight = [Position.Left, Position.Right];

    let path;
    let firstCornerPath = null;
    let secondCornerPath = null;

    // default case: source and target positions are top or bottom
    if (sourceX < targetX) {
      firstCornerPath =
        sourceY < targetY
          ? bottomLeftCorner(sourceX, centerY, cornerSize)
          : topLeftCorner(sourceX, centerY, cornerSize);
      secondCornerPath =
        sourceY < targetY
          ? rightTopCorner(targetX, centerY, cornerSize)
          : rightBottomCorner(targetX, centerY, cornerSize);
    } else if (sourceX > targetX) {
      firstCornerPath =
        sourceY < targetY
          ? bottomRightCorner(sourceX, centerY, cornerSize)
          : topRightCorner(sourceX, centerY, cornerSize);
      secondCornerPath =
        sourceY < targetY
          ? leftTopCorner(targetX, centerY, cornerSize)
          : leftBottomCorner(targetX, centerY, cornerSize);
    }

    if (leftAndRight.includes(sourcePosition) && leftAndRight.includes(targetPosition)) {
      if (sourceX < targetX) {
        firstCornerPath =
          sourceY < targetY
            ? rightTopCorner(centerX, sourceY, cornerSize)
            : rightBottomCorner(centerX, sourceY, cornerSize);
        secondCornerPath =
          sourceY < targetY
            ? bottomLeftCorner(centerX, targetY, cornerSize)
            : topLeftCorner(centerX, targetY, cornerSize);
      }
    } else if (leftAndRight.includes(sourcePosition) && !leftAndRight.includes(targetPosition)) {
      if (sourceX < targetX) {
        firstCornerPath =
          sourceY < targetY
            ? rightTopCorner(targetX, sourceY, cornerSize)
            : rightBottomCorner(targetX, sourceY, cornerSize);
      } else if (sourceX > targetX) {
        firstCornerPath =
          sourceY < targetY
            ? bottomRightCorner(sourceX, targetY, cornerSize)
            : topRightCorner(sourceX, targetY, cornerSize);
      }
      secondCornerPath = '';
    } else if (!leftAndRight.includes(sourcePosition) && leftAndRight.includes(targetPosition)) {
      if (sourceX < targetX) {
        firstCornerPath =
          sourceY < targetY
            ? bottomLeftCorner(sourceX, targetY, cornerSize)
            : topLeftCorner(sourceX, targetY, cornerSize);
      } else if (sourceX > targetX) {
        firstCornerPath =
          sourceY < targetY
            ? bottomRightCorner(sourceX, targetY, cornerSize)
            : topRightCorner(sourceX, targetY, cornerSize);
      }
      secondCornerPath = '';
    }

    path = `M ${sourceX},${sourceY}${firstCornerPath}${secondCornerPath}L ${targetX},${targetY}`;

    const text = label ? (
      <EdgeText
        x={centerX}
        y={centerY}
        label={label}
        labelStyle={labelStyle}
        labelShowBg={labelShowBg}
        labelBgStyle={labelBgStyle}
      />
    ) : null;

    return (
      <>
        <path style={style} className="react-flow__edge-path" d={path} />
        {text}
      </>
    );
  }
);
