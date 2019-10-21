import React, { memo } from 'react';

import { EdgeBezierProps } from '../../types';

export default memo(
  ({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition = 'bottom',
    targetPosition = 'top',
    style = {},
  }: EdgeBezierProps) => {
    const yOffset = Math.abs(targetY - sourceY) / 2;
    const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;

    let dAttr = `M${sourceX},${sourceY} C${sourceX},${centerY} ${targetX},${centerY} ${targetX},${targetY}`;

    if (
      ['left', 'right'].includes(sourcePosition) &&
      ['left', 'right'].includes(targetPosition)
    ) {
      const xOffset = Math.abs(targetX - sourceX) / 2;
      const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;

      dAttr = `M${sourceX},${sourceY} C${centerX},${sourceY} ${centerX},${targetY} ${targetX},${targetY}`;
    } else if (
      ['left', 'right'].includes(sourcePosition) ||
      ['left', 'right'].includes(targetPosition)
    ) {
      dAttr = `M${sourceX},${sourceY} C${sourceX},${targetY} ${sourceX},${targetY} ${targetX},${targetY}`;
    }

    return <path {...style} d={dAttr} />;
  }
);
