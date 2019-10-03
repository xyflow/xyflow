import React, { useEffect, useState, memo } from 'react';
import cx from 'classnames';

export default (props) => {
  const [sourceNode, setSourceNode] = useState(null);
  const hasHandleId = props.connectionSourceId.includes('__');
  const sourceIdSplitted = props.connectionSourceId.split('__');
  const nodeId = sourceIdSplitted[0];
  const handleId = hasHandleId ? sourceIdSplitted[1] : null;

  useEffect(() => {
    setSourceNode(props.nodes.find(n => n.id === nodeId));
  }, []);

  if (!sourceNode) {
    return null;
  }

  const style = props.connectionLineStyle || {};
  const className = cx('react-graph__edge', 'connection', props.className);

  const sourceHandle = handleId ? sourceNode.__rg.handleBounds.source.find(d => d.id === handleId) : sourceNode.__rg.handleBounds.source[0];
  const sourceHandleX = sourceHandle ? sourceHandle.x + (sourceHandle.width / 2) : sourceNode.__rg.width / 2;
  const sourceHandleY = sourceHandle ? sourceHandle.y + (sourceHandle.height / 2) : sourceNode.__rg.height;
  const sourceX = sourceNode.__rg.position.x + sourceHandleX;
  const sourceY = sourceNode.__rg.position.y + sourceHandleY;

  const targetX = (props.connectionPositionX - props.transform[0]) * (1 / props.transform[2]);
  const targetY = (props.connectionPositionY - props.transform[1]) * (1 / props.transform[2]);

  let dAttr = '';

  if (props.connectionLineType === 'bezier') {
    const yOffset = Math.abs(targetY - sourceY) / 2;
    const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;
    dAttr = `M${sourceX},${sourceY} C${sourceX},${centerY} ${targetX},${centerY} ${targetX},${targetY}`;
  } else {
    dAttr = `M${sourceX},${sourceY} ${targetX},${targetY}`;
  }

  return (
    <g className={className}>
      <path
        d={dAttr}
        {...style}
      />
    </g>
  );
};
