import React, { memo } from 'react';

import { EdgeProps } from '../../types';

export default memo(({
  sourceX, sourceY, targetX, targetY, style = {}
} : EdgeProps) => {
  const yOffset = Math.abs(targetY - sourceY) / 2;
  const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;

  return (
    <path
      {...style}
      d={`M ${sourceX},${sourceY}L ${sourceX},${centerY}L ${targetX},${centerY}L ${targetX},${targetY}`}
    />
  );
});
