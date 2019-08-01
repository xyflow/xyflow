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
  const _sourceHandleY = hasSourceHandle ? sourceHandleY + (sourceHandleHeight / 2) : sourceNodeHeight;
  const sourceX = sourceNodeX + _sourceHandleX;
  const sourceY = sourceNodeY + _sourceHandleY;

  const _targetHandleX = hasTargetHandle ? targetHandleX + (targetHandleWidth / 2) : targetNodeWidth / 2;
  const _targetHandleY = hasTargetHandle ? targetHandleY + (targetHandleHeight / 2) : 0;
  const targetX = targetNodeX + _targetHandleX;
  const targetY = targetNodeY + _targetHandleY;

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
