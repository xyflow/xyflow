import React, { memo } from 'react';

export default memo((props) => {
  const {
    sourceX, sourceY, targetX, targetY, style = {}
  } = props;

  const yOffset = Math.abs(targetY - sourceY) / 2;
  const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;

  return (
    <path
      {...style}
      d={`M ${sourceX},${sourceY}L ${sourceX},${centerY}L ${targetX},${centerY}L ${targetX},${targetY}`}
    />
  );
});
