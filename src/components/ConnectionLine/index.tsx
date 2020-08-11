import React, { useEffect, useState, CSSProperties } from 'react';
import cc from 'classcat';

import { getBezierPath } from '../Edges/BezierEdge';
import { getSmoothStepPath } from '../Edges/SmoothStepEdge';
import { ElementId, Node, Transform, HandleElement, Position, ConnectionLineType, HandleType } from '../../types';

interface ConnectionLineProps {
  connectionNodeId: ElementId;
  connectionHandleType: HandleType;
  connectionPositionX: number;
  connectionPositionY: number;
  connectionLineType: ConnectionLineType;
  nodes: Node[];
  transform: Transform;
  isConnectable: boolean;
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
  isConnectable,
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

  if (!sourceNode || !isConnectable) {
    return null;
  }

  const connectionLineClasses: string = cc(['react-flow__connection', className]);

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

  const isRightOrLeft = sourceHandle?.position === Position.Left || sourceHandle?.position === Position.Right;
  const targetPosition = isRightOrLeft ? Position.Left : Position.Top;

  if (connectionLineType === ConnectionLineType.Bezier) {
    dAttr = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition: sourceHandle?.position,
      targetX,
      targetY,
      targetPosition,
    });
  } else if (connectionLineType === ConnectionLineType.Step) {
    dAttr = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition: sourceHandle?.position,
      targetX,
      targetY,
      targetPosition,
      borderRadius: 0,
    });
  } else if (connectionLineType === ConnectionLineType.SmoothStep) {
    dAttr = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition: sourceHandle?.position,
      targetX,
      targetY,
      targetPosition,
    });
  } else {
    dAttr = `M${sourceX},${sourceY} ${targetX},${targetY}`;
  }

  return (
    <g className={connectionLineClasses}>
      <path d={dAttr} className="react-flow__connection-path" style={connectionLineStyle} />
    </g>
  );
};
