import React, { useRef, CSSProperties } from 'react';
import shallow from 'zustand/shallow';

import { useStore } from '../../store';
import { getBezierPath } from '../Edges/BezierEdge';
import { getSmoothStepPath } from '../Edges/SmoothStepEdge';
import {
  HandleElement,
  ConnectionLineType,
  ConnectionLineComponent,
  HandleType,
  Node,
  ReactFlowState,
  Position,
} from '../../types';
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

const getSourceHandle = (handleId: string | null, sourceNode: Node, connectionHandleType: HandleType) => {
  const handleTypeInverted = connectionHandleType === 'source' ? 'target' : 'source';
  const handleBound = sourceNode.handleBounds?.[connectionHandleType] || sourceNode.handleBounds?.[handleTypeInverted];

  return handleId ? handleBound?.find((d: HandleElement) => d.id === handleId) : handleBound?.[0];
};

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
  const sourceNode = useRef<Node | undefined>(nodeInternals.get(nodeId));

  if (
    !sourceNode.current ||
    !sourceNode.current ||
    !isConnectable ||
    !sourceNode.current.handleBounds?.[connectionHandleType]
  ) {
    return null;
  }

  const sourceHandle = getSourceHandle(handleId, sourceNode.current, connectionHandleType);
  const sourceHandleX = sourceHandle ? sourceHandle.x + sourceHandle.width / 2 : (sourceNode.current?.width ?? 0) / 2;
  const sourceHandleY = sourceHandle ? sourceHandle.y + sourceHandle.height / 2 : sourceNode.current?.height ?? 0;
  const sourceX = (sourceNode.current.positionAbsolute?.x || 0) + sourceHandleX;
  const sourceY = (sourceNode.current.positionAbsolute?.y || 0) + sourceHandleY;

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
          sourceNode={sourceNode.current as Node}
          sourceHandle={sourceHandle}
        />
      </g>
    );
  }

  let dAttr: string = '';

  const pathParams = {
    sourceX,
    sourceY,
    sourcePosition: sourceHandle?.position,
    targetX,
    targetY,
    targetPosition,
  };

  if (connectionLineType === ConnectionLineType.Bezier) {
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
