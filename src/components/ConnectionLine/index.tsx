import React, { useRef, CSSProperties } from 'react';
import shallow from 'zustand/shallow';

import { useStore } from '../../store';
import { getBezierPath } from '../Edges/BezierEdge';
import { getSmoothStepPath } from '../Edges/SmoothStepEdge';
import {
  ElementId,
  NodeLookupItem,
  HandleElement,
  Position,
  ConnectionLineType,
  ConnectionLineComponent,
  HandleType,
  Node,
  ReactFlowState,
} from '../../types';

interface ConnectionLineProps {
  connectionNodeId: ElementId;
  connectionHandleId: ElementId | null;
  connectionHandleType: HandleType;
  connectionPositionX: number;
  connectionPositionY: number;
  connectionLineType: ConnectionLineType;
  isConnectable: boolean;
  connectionLineStyle?: CSSProperties;
  CustomConnectionLineComponent?: ConnectionLineComponent;
}

const selector = (s: ReactFlowState) => ({ nodeLookup: s.nodeLookup, nodes: s.nodes, transform: s.transform });

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

  const { nodeLookup, nodes, transform } = useStore(selector, shallow);
  const sourceNodeInternals = useRef<NodeLookupItem | undefined>(nodeLookup.get(nodeId));
  const sourceNode = useRef<Node | undefined>(nodes.find((n) => n.id === nodeId));

  if (
    !sourceNode.current ||
    !sourceNodeInternals.current ||
    !isConnectable ||
    !sourceNodeInternals.current.handleBounds?.[connectionHandleType]
  ) {
    return null;
  }

  const sourceHandle = handleId
    ? sourceNodeInternals.current.handleBounds[connectionHandleType]!.find((d: HandleElement) => d.id === handleId)
    : sourceNodeInternals.current.handleBounds[connectionHandleType]![0];
  const sourceHandleX = sourceHandle ? sourceHandle.x + sourceHandle.width / 2 : sourceNodeInternals.current.width! / 2;
  const sourceHandleY = sourceHandle ? sourceHandle.y + sourceHandle.height / 2 : sourceNodeInternals.current.height!;
  const sourceX = sourceNodeInternals.current.positionAbsolute!.x + sourceHandleX;
  const sourceY = sourceNodeInternals.current.positionAbsolute!.y + sourceHandleY;

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
