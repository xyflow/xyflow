import React from 'react';

export default (props) => {
  const { targetNode, sourceNode } = props;
  const style = props.style || {};

  const sourceX = sourceNode.__rg.position.x + (sourceNode.__rg.width / 2);
  const sourceY = sourceNode.__rg.position.y + sourceNode.__rg.height;

  const targetX = targetNode.__rg.position.x + (targetNode.__rg.width / 2);
  const targetY = targetNode.__rg.position.y;

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
