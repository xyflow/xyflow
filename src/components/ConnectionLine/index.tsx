import React, { useEffect, useState, CSSProperties } from 'react';

import { getBezierPath } from '../Edges/BezierEdge';
import { getSmoothStepPath } from '../Edges/SmoothStepEdge';
import {
  ElementId,
  Node,
  Transform,
  HandleElement,
  Position,
  ConnectionLineType,
  ConnectionLineComponent,
  HandleType,
} from '../../types';

interface ConnectionLineProps {
  connectionNodeId: ElementId;
  connectionHandleId: ElementId | null;
  connectionHandleType: HandleType;
  connectionPositionX: number;
  connectionPositionY: number;
  connectionLineType: ConnectionLineType;
  nodes: Node[];
  transform: Transform;
  isConnectable: boolean;
  connectionLineStyle?: CSSProperties;
  CustomConnectionLineComponent?: ConnectionLineComponent;
}

const getSourceHandle = (handleId: ElementId | null, sourceNode: Node, connectionHandleType: HandleType) => {
  const handleTypeInverted = connectionHandleType === 'source' ? 'target' : 'source';
  const handleBound =
    sourceNode.__rf.handleBounds[connectionHandleType] || sourceNode.__rf.handleBounds[handleTypeInverted];

  return handleId ? handleBound.find((d: HandleElement) => d.id === handleId) : handleBound[0];
};

export default ({
  connectionNodeId,
  connectionHandleId,
  connectionHandleType,
  connectionLineStyle,
  connectionPositionX,
  connectionPositionY,
  connectionLineType = ConnectionLineType.Bezier,
  nodes = [],
  transform,
  isConnectable,
  CustomConnectionLineComponent,
}: ConnectionLineProps) => {
  const [sourceNode, setSourceNode] = useState<Node | null>(null);
  const nodeId = connectionNodeId;
  const handleId = connectionHandleId;

  useEffect(() => {
    const nextSourceNode = nodes.find((n) => n.id === nodeId) || null;
    setSourceNode(nextSourceNode);
  }, []);

  if (!sourceNode || !isConnectable) {
    return null;
  }

  const sourceHandle = getSourceHandle(handleId, sourceNode, connectionHandleType);
  const sourceHandleX = sourceHandle ? sourceHandle.x + sourceHandle.width / 2 : sourceNode.__rf.width / 2;
  const sourceHandleY = sourceHandle ? sourceHandle.y + sourceHandle.height / 2 : sourceNode.__rf.height;
  const sourceX = sourceNode.__rf.position.x + sourceHandleX;
  const sourceY = sourceNode.__rf.position.y + sourceHandleY;

  const targetX = (connectionPositionX - transform[0]) / transform[2];
  const targetY = (connectionPositionY - transform[1]) / transform[2];

  const isRightOrLeft = sourceHandle?.position === Position.Left || sourceHandle?.position === Position.Right;
  const targetPosition = isRightOrLeft ? Position.Left : Position.Top;

  if (CustomConnectionLineComponent) {
    return (
      <g className="react-flow__connection">
        <CustomConnectionLineComponent
          sourceX={sourceX}
          sourceY={sourceY}
          sourcePosition={sourceHandle?.position}
          targetX={targetX}
          targetY={targetY}
          targetPosition={targetPosition}
          connectionLineType={connectionLineType}
          connectionLineStyle={connectionLineStyle}
          sourceNode={sourceNode}
          sourceHandle={sourceHandle}
        />
      </g>
    );
  }

  let dAttr: string = '';

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
    <g className="react-flow__connection">
      <path d={dAttr} className="react-flow__connection-path" style={connectionLineStyle} />
    </g>
  );
};
