import React, { useRef, CSSProperties } from 'react';
import shallow from 'zustand/shallow';

import { useStore } from '../../store';
import { getBezierPath } from '../Edges/BezierEdge';
import { getSmoothStepPath } from '../Edges/SmoothStepEdge';
import { ConnectionLineType, ConnectionLineComponent, HandleType, Node, ReactFlowState, Position } from '../../types';
import { getSimpleBezierPath } from '../Edges/SimpleBezierEdge';

interface ConnectionLineProps {
  connectionNodeId: string;
  connectionHandleId: string | null;
  connectionHandleType: HandleType;
  connectionPositionX: number;
  connectionPositionY: number;
  connectionLineType: ConnectionLineType;
  isConnectable: boolean;
  connectionLineStyle?: CSSProperties;
  CustomConnectionLineComponent?: ConnectionLineComponent;
}

const selector = (s: ReactFlowState) => ({ nodeInternals: s.nodeInternals, transform: s.transform });

export default ({
  connectionNodeId,
  connectionHandleId,
  connectionHandleType,
  connectionLineStyle,
  connectionPositionX,
  connectionPositionY,
  connectionLineType = ConnectionLineType.Bezier,
  isConnectable,
  CustomConnectionLineComponent,
}: ConnectionLineProps) => {
  const nodeId = connectionNodeId;
  const handleId = connectionHandleId;

  const { nodeInternals, transform } = useStore(selector, shallow);
  const fromNode = useRef<Node | undefined>(nodeInternals.get(nodeId));

  if (
    !fromNode.current ||
    !fromNode.current ||
    !isConnectable ||
    !fromNode.current.handleBounds?.[connectionHandleType]
  ) {
    return null;
  }

  const handleBound = fromNode.current.handleBounds?.[connectionHandleType];
  const fromHandle = handleId ? handleBound?.find((d) => d.id === handleId) : handleBound?.[0];
  const fromHandleX = fromHandle ? fromHandle.x + fromHandle.width / 2 : (fromNode.current?.width ?? 0) / 2;
  const fromHandleY = fromHandle ? fromHandle.y + fromHandle.height / 2 : fromNode.current?.height ?? 0;
  const fromX = (fromNode.current.positionAbsolute?.x || 0) + fromHandleX;
  const fromY = (fromNode.current.positionAbsolute?.y || 0) + fromHandleY;

  const toX = (connectionPositionX - transform[0]) / transform[2];
  const toY = (connectionPositionY - transform[1]) / transform[2];

  const fromPosition = fromHandle?.position;

  let toPosition: Position | undefined;
  switch (fromPosition) {
    case Position.Left:
      toPosition = Position.Right;
      break;
    case Position.Right:
      toPosition = Position.Left;
      break;
    case Position.Top:
      toPosition = Position.Bottom;
      break;
    case Position.Bottom:
      toPosition = Position.Top;
      break;
  }

  let sourceX: number,
    sourceY: number,
    sourcePosition: Position | undefined,
    targetX: number,
    targetY: number,
    targetPosition: Position | undefined;

  switch (connectionHandleType) {
    case 'source':
      {
        sourceX = fromX;
        sourceY = fromY;
        sourcePosition = fromPosition;
        targetX = toX;
        targetY = toY;
        targetPosition = toPosition;
      }
      break;
    case 'target':
      {
        sourceX = toX;
        sourceY = toY;
        sourcePosition = toPosition;
        targetX = fromX;
        targetY = fromY;
        targetPosition = fromPosition;
      }
      break;
  }

  if (CustomConnectionLineComponent) {
    return (
      <g className="react-flow__connection">
        <CustomConnectionLineComponent
          sourceX={sourceX}
          sourceY={sourceY}
          sourcePosition={sourcePosition}
          targetX={targetX}
          targetY={targetY}
          targetPosition={targetPosition}
          connectionLineType={connectionLineType}
          connectionLineStyle={connectionLineStyle}
          fromNode={fromNode.current}
          fromHandle={fromHandle}
          // backward compatibility, mark as deprecated?
          sourceNode={fromNode.current}
          sourceHandle={fromHandle}
        />
      </g>
    );
  }

  let dAttr: string = '';

  const pathParams = {
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  };

  if (connectionLineType === ConnectionLineType.Bezier) {
    // we assume the destination position is opposite to the source position
    dAttr = getBezierPath(pathParams);
  } else if (connectionLineType === ConnectionLineType.Step) {
    dAttr = getSmoothStepPath({
      ...pathParams,
      borderRadius: 0,
    });
  } else if (connectionLineType === ConnectionLineType.SmoothStep) {
    dAttr = getSmoothStepPath(pathParams);
  } else if (connectionLineType === ConnectionLineType.SimpleBezier) {
    dAttr = getSimpleBezierPath(pathParams);
  } else {
    dAttr = `M${sourceX},${sourceY} ${targetX},${targetY}`;
  }

  return (
    <g className="react-flow__connection">
      <path d={dAttr} className="react-flow__connection-path" style={connectionLineStyle} />
    </g>
  );
};
