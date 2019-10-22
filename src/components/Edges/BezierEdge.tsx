import React, { memo } from 'react';

import { EdgeBezierProps, Position } from '../../types';

export default memo(
  ({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition = Position.Bottom,
    targetPosition = Position.Top,
    style = {},
  }: EdgeBezierProps) => {
    const yOffset = Math.abs(targetY - sourceY) / 2;
    const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;

    let dAttr = `M${sourceX},${sourceY} C${sourceX},${centerY} ${targetX},${centerY} ${targetX},${targetY}`;

    const leftAndRight = [Position.Left, Position.Right];
    if (leftAndRight.includes(sourcePosition) && leftAndRight.includes(targetPosition)) {
      const xOffset = Math.abs(targetX - sourceX) / 2;
      const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;

      dAttr = `M${sourceX},${sourceY} C${centerX},${sourceY} ${centerX},${targetY} ${targetX},${targetY}`;
    } else if (leftAndRight.includes(sourcePosition) || leftAndRight.includes(targetPosition)) {
      dAttr = `M${sourceX},${sourceY} C${sourceX},${targetY} ${sourceX},${targetY} ${targetX},${targetY}`;
    }

    return <path {...style} d={dAttr} />;
  }
);
