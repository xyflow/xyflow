import React, { useEffect, useState, CSSProperties } from 'react';
import cx from 'classnames';

import { ElementId, Node, Transform, HandleElement, Position, ConnectionLineType, HandleType } from '../../types';

interface ConnectionLineProps {
  connectionNodeId: ElementId;
  connectionHandleType: HandleType;
  connectionPositionX: number;
  connectionPositionY: number;
  connectionLineType: ConnectionLineType;
  nodes: Node[];
  transform: Transform;
  isInteractive: boolean;
  connectionLineStyle?: CSSProperties;
  className?: string;
}

export default ({
  connectionNodeId,
  connectionHandleType,
  connectionLineStyle,
  connectionPositionX,
  connectionPositionY,
  connectionLineType = ConnectionLineType.Bezier,
  nodes = [],
  className,
  transform,
  isInteractive,
}: ConnectionLineProps) => {
  const [sourceNode, setSourceNode] = useState<Node | null>(null);
  const hasHandleId = connectionNodeId.includes('__');
  const sourceIdSplitted = connectionNodeId.split('__');
  const nodeId = sourceIdSplitted[0];
  const handleId = hasHandleId ? sourceIdSplitted[1] : null;

  useEffect(() => {
    const nextSourceNode = nodes.find((n) => n.id === nodeId) || null;
    setSourceNode(nextSourceNode);
  }, []);

  if (!sourceNode || !isInteractive) {
    return null;
  }

  const connectionLineClasses: string = cx('react-flow__connection', className);

  const sourceHandle = handleId
    ? sourceNode.__rf.handleBounds[connectionHandleType].find((d: HandleElement) => d.id === handleId)
    : sourceNode.__rf.handleBounds[connectionHandleType][0];
  const sourceHandleX = sourceHandle ? sourceHandle.x + sourceHandle.width / 2 : sourceNode.__rf.width / 2;
  const sourceHandleY = sourceHandle ? sourceHandle.y + sourceHandle.height / 2 : sourceNode.__rf.height;
  const sourceX = sourceNode.__rf.position.x + sourceHandleX;
  const sourceY = sourceNode.__rf.position.y + sourceHandleY;

  const targetX = (connectionPositionX - transform[0]) * (1 / transform[2]);
  const targetY = (connectionPositionY - transform[1]) * (1 / transform[2]);

  let dAttr: string = '';

  if (connectionLineType === ConnectionLineType.Bezier) {
    if (sourceHandle?.position === Position.Left || sourceHandle?.position === Position.Right) {
      const xOffset = Math.abs(targetX - sourceX) / 2;
      const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;
      dAttr = `M${sourceX},${sourceY} C${centerX},${sourceY} ${centerX},${targetY} ${targetX},${targetY}`;
    } else {
      const yOffset = Math.abs(targetY - sourceY) / 2;
      const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;
      dAttr = `M${sourceX},${sourceY} C${sourceX},${centerY} ${targetX},${centerY} ${targetX},${targetY}`;
    }
  } else {
    dAttr = `M${sourceX},${sourceY} ${targetX},${targetY}`;
  }

  return (
    <g className={connectionLineClasses}>
      <path d={dAttr} className="react-flow__connection-path" style={connectionLineStyle} />
    </g>
  );
};
