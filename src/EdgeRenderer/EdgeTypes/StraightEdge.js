import React from 'react';

export default (props) => {
  const { targetNode, sourceNode } = props;
  const style = props.style || {};

  const sourceHandle = sourceNode.__rg.handleBounds.source;
  const sourceHandleX = sourceHandle ? sourceHandle.x + (sourceHandle.width / 2) : sourceNode.__rg.width / 2;
  const sourceX = sourceNode.__rg.position.x + sourceHandleX;
  const sourceY = sourceNode.__rg.position.y + sourceNode.__rg.height;

  const targetHandle = targetNode.__rg.handleBounds.target;
  const targetHandleX = targetHandle ? targetHandle.x + (targetHandle.width / 2) : targetNode.__rg.width / 2;
  const targetX = targetNode.__rg.position.x + targetHandleX;
  const targetY = targetNode.__rg.position.y;

  return (
    <path
      {...style}
      d={`M ${sourceX},${sourceY}L ${targetX},${targetY}`}
    />
  );
};
