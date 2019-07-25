import React from 'react';

export default (props) => {
  const { targetNode, sourceNode } = props;
  const style = props.data ? props.data.style : {};

  const sourceX = sourceNode.__rg.position.x + (sourceNode.__rg.width / 2);
  const sourceY = sourceNode.__rg.position.y + sourceNode.__rg.height;

  const targetX = targetNode.__rg.position.x + (targetNode.__rg.width / 2);
  const targetY = targetNode.__rg.position.y;

  return (
    <path
      {...style}
      d={`M ${sourceX},${sourceY}L ${targetX},${targetY}`}
    />
  );
};
