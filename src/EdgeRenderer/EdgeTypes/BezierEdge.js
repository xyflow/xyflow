import React, { memo } from 'react';

export default memo((props) => {
  const {
    sourceX, sourceY, targetX, targetY, style = {}
  } = props;

  const yOffset = Math.abs(targetY - sourceY) / 2;
  const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;
  const dAttr = `M${sourceX},${sourceY} C${sourceX},${centerY} ${targetX},${centerY} ${targetX},${targetY}`;

  return (
    <path
      {...style}
      d={dAttr}
    />
  );
});
