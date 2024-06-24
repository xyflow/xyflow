import { CSSProperties, useCallback } from 'react';
import { shallow } from 'zustand/shallow';
import cc from 'classcat';
import {
  Position,
  ConnectionLineType,
  ConnectionMode,
  getBezierPath,
  getSmoothStepPath,
  type HandleType,
} from '@xyflow/system';

import { useStore } from '../../hooks/useStore';
import { getSimpleBezierPath } from '../Edges/SimpleBezierEdge';
import type { ConnectionLineComponent, ReactFlowState, ReactFlowStore } from '../../types';

function getConnectionStatus(isValid: boolean | null) {
  if (isValid === null) {
    return null;
  }

  return isValid ? 'valid' : 'invalid';
}

type ConnectionLineProps = {
  nodeId: string;
  handleType: HandleType;
  type: ConnectionLineType;
  style?: CSSProperties;
  CustomComponent?: ConnectionLineComponent;
  isValid: boolean | null;
};

const oppositePosition = {
  [Position.Left]: Position.Right,
  [Position.Right]: Position.Left,
  [Position.Top]: Position.Bottom,
  [Position.Bottom]: Position.Top,
};

const ConnectionLine = ({
  nodeId,
  handleType,
  style,
  type = ConnectionLineType.Bezier,
  CustomComponent,
  isValid,
}: ConnectionLineProps) => {
  const { fromNode, startHandle, endHandle, toX, toY, connectionMode } = useStore(
    useCallback(
      (s: ReactFlowStore) => ({
        fromNode: s.nodeLookup.get(nodeId),
        startHandle: s.connection.fromHandle,
        endHandle: s.connection.toHandle,
        toX: (s.connection.position.x - s.transform[0]) / s.transform[2],
        toY: (s.connection.position.y - s.transform[1]) / s.transform[2],
        connectionMode: s.connectionMode,
      }),
      [nodeId]
    ),
    shallow
  );

  const fromHandleBounds = fromNode?.internals.handleBounds;
  let handleBounds = fromHandleBounds?.[handleType];

  if (connectionMode === ConnectionMode.Loose) {
    handleBounds = handleBounds ? handleBounds : fromHandleBounds?.[handleType === 'source' ? 'target' : 'source'];
  }

  if (!fromNode || !handleBounds) {
    return null;
  }

  const handleId = startHandle?.handleId;
  const fromHandle = handleId ? handleBounds.find((d) => d.id === handleId) : handleBounds[0];
  const fromHandleX = fromHandle ? fromHandle.x + fromHandle.width / 2 : (fromNode.measured.width ?? 0) / 2;
  const fromHandleY = fromHandle ? fromHandle.y + fromHandle.height / 2 : fromNode.measured.height ?? 0;
  const fromX = fromNode.internals.positionAbsolute.x + fromHandleX;
  const fromY = fromNode.internals.positionAbsolute.y + fromHandleY;
  const fromPosition = fromHandle?.position;
  const toPosition =
    isValid && endHandle?.position ? endHandle.position : fromPosition ? oppositePosition[fromPosition] : null;

  if (!fromPosition || !toPosition) {
    return null;
  }

  if (CustomComponent) {
    return (
      <CustomComponent
        connectionLineType={type}
        connectionLineStyle={style}
        fromNode={fromNode.internals.userNode}
        fromHandle={fromHandle}
        fromX={fromX}
        fromY={fromY}
        toX={toX}
        toY={toY}
        fromPosition={fromPosition}
        toPosition={toPosition}
        connectionStatus={getConnectionStatus(isValid)}
      />
    );
  }

  let dAttr = '';

  const pathParams = {
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition,
  };

  if (type === ConnectionLineType.Bezier) {
    // we assume the destination position is opposite to the source position
    [dAttr] = getBezierPath(pathParams);
  } else if (type === ConnectionLineType.Step) {
    [dAttr] = getSmoothStepPath({
      ...pathParams,
      borderRadius: 0,
    });
  } else if (type === ConnectionLineType.SmoothStep) {
    [dAttr] = getSmoothStepPath(pathParams);
  } else if (type === ConnectionLineType.SimpleBezier) {
    [dAttr] = getSimpleBezierPath(pathParams);
  } else {
    dAttr = `M${fromX},${fromY} ${toX},${toY}`;
  }

  return <path d={dAttr} fill="none" className="react-flow__connection-path" style={style} />;
};

ConnectionLine.displayName = 'ConnectionLine';

type ConnectionLineWrapperProps = {
  type: ConnectionLineType;
  component?: ConnectionLineComponent;
  containerStyle?: CSSProperties;
  style?: CSSProperties;
};

const selector = (s: ReactFlowState) => ({
  nodeId: s.connection.fromHandle?.nodeId,
  handleType: s.connection.fromHandle?.type,
  nodesConnectable: s.nodesConnectable,
  isValid: s.connection.isValid,
  width: s.width,
  height: s.height,
});

export function ConnectionLineWrapper({ containerStyle, style, type, component }: ConnectionLineWrapperProps) {
  const { nodeId, handleType, nodesConnectable, width, height, isValid } = useStore(selector, shallow);
  const isIncorrect = !(nodeId && handleType && width && nodesConnectable);

  if (isIncorrect) {
    return null;
  }

  return (
    <svg
      style={containerStyle}
      width={width}
      height={height}
      className="react-flow__connectionline react-flow__container"
    >
      <g className={cc(['react-flow__connection', getConnectionStatus(isValid)])}>
        <ConnectionLine
          nodeId={nodeId}
          handleType={handleType}
          style={style}
          type={type}
          CustomComponent={component}
          isValid={isValid}
        />
      </g>
    </svg>
  );
}
