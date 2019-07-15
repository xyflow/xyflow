import React from 'react';
import styled from '@emotion/styled';

const Path = styled.path`
  fill: none;
  stroke: #333;
  stroke-width: 2;
`;

export default (props) => {
  const { targetNode, sourceNode } = props;

  const sourceX = sourceNode.position.x + (sourceNode.data.__width / 2);
  const sourceY = sourceNode.position.y + sourceNode.data.__height;

  const targetX = targetNode.position.x + (targetNode.data.__width / 2);
  const targetY = targetNode.position.y;

  return (
    <Path
      d={`M ${sourceX},${sourceY}L ${targetX},${targetY}`}
    />
  );
};
