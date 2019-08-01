import React, { memo } from 'react';

export default memo((props) => {
  const {
    sourceNodeX, sourceNodeY, sourceNodeWidth, sourceNodeHeight,
    targetNodeX, targetNodeY, targetNodeWidth, targetNodeHeight,
    sourceHandleX, sourceHandleY, sourceHandleWidth, sourceHandleHeight,
    targetHandleX, targetHandleY, targetHandleWidth, targetHandleHeight,
    hasSourceHandle, hasTargetHandle, style = {}
  } = props;

  const _sourceHandleX = hasSourceHandle ? sourceHandleX + (sourceHandleWidth / 2) : sourceNodeWidth / 2;
  const sourceX = sourceNodeX + _sourceHandleX;
  const sourceY = sourceNodeY + sourceNodeHeight;

  const _targetHandleX = hasTargetHandle ? targetHandleX + (targetHandleWidth / 2) : targetNodeWidth / 2;
  const targetX = targetNodeX + _targetHandleX;
  const targetY = targetNodeY;

  return (
    <path
      {...style}
      d={`M ${sourceX},${sourceY}L ${targetX},${targetY}`}
    />
  );
});
