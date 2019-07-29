import React from 'react';

export default (props) => {
  const { targetNode, sourceNode } = props;
  const style = props.style || {};

  const sourceHandle = sourceNode.__rg.handleBounds.source;
  const sourceHandleX = sourceHandle ? sourceHandle.x + (sourceHandle.width / 2) : sourceNode.__rg.width / 2;
  const sourceHandleY = sourceHandle ? sourceHandle.y + (sourceHandle.height / 2) : sourceNode.__rg.height;
  const sourceX = sourceNode.__rg.position.x + sourceHandleX;
  const sourceY = sourceNode.__rg.position.y + sourceHandleY;

  const targetHandle = targetNode.__rg.handleBounds.target;
  const targetHandleX = targetHandle ? targetHandle.x + (targetHandle.width / 2) : targetNode.__rg.width / 2;
  const targetHandleY = targetHandle ? targetHandle.y + (targetHandle.height / 2) : 0;
  const targetX = targetNode.__rg.position.x + targetHandleX;
  const targetY = targetNode.__rg.position.y + targetHandleY;

  const yOffset = Math.abs(targetY - sourceY) / 2;
  const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;
  const dAttr = `M${sourceX},${sourceY} C${sourceX},${centerY} ${targetX},${centerY} ${targetX},${targetY}`;

  return (
    <path
      {...style}
      d={dAttr}
    />
  );
};
