import React, { memo } from 'react';

export default memo((props) => {
  const {
    sourceX, sourceY, targetX, targetY, style = {}
  } = props;

  return (
    <path
      {...style}
      d={`M ${sourceX},${sourceY}L ${targetX},${targetY}`}
    />
  );
});
