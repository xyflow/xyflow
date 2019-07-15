import React from 'react';

export default (props) => {
  const { targetNode, sourceNode } = props;

  const sourceX = sourceNode.position.x + (sourceNode.data.__width / 2);
  const sourceY = sourceNode.position.y + sourceNode.data.__height;

  const targetX = targetNode.position.x + (targetNode.data.__width / 2);
  const targetY = targetNode.position.y;

  return (
    <path
      className="react-graph__edge"
      d={`M ${sourceX},${sourceY}L ${targetX},${targetY}`}
    />
  );
};
