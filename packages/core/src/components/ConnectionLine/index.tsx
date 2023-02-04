import { CSSProperties, useCallback } from 'react';
import { shallow } from 'zustand/shallow';
import cc from 'classcat';

import { useStore } from '../../hooks/useStore';
import { getBezierPath } from '../Edges/BezierEdge';
import { getSmoothStepPath } from '../Edges/SmoothStepEdge';
import { getSimpleBezierPath } from '../Edges/SimpleBezierEdge';
import { internalsSymbol } from '../../utils';
import type {
  ConnectionLineComponent,
  ConnectionStatus,
  HandleType,
  ReactFlowState,
  ReactFlowStore,
} from '../../types';
import { Position, ConnectionLineType, ConnectionMode } from '../../types';

type ConnectionLineProps = {
  nodeId: string;
  handleType: HandleType;
  type: ConnectionLineType;
  style?: CSSProperties;
  CustomComponent?: ConnectionLineComponent;
  connectionStatus: ConnectionStatus | null;
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
  connectionStatus,
}: ConnectionLineProps) => {
  const { fromNode, handleId, toX, toY, connectionMode } = useStore(
    useCallback(
      (s: ReactFlowStore) => ({
        fromNode: s.nodeInternals.get(nodeId),
        handleId: s.connectionHandleId,
        toX: (s.connectionPosition.x - s.transform[0]) / s.transform[2],
        toY: (s.connectionPosition.y - s.transform[1]) / s.transform[2],
        connectionMode: s.connectionMode,
      }),
      [nodeId]
    ),
    shallow
  );
  const fromHandleBounds = fromNode?.[internalsSymbol]?.handleBounds;
  let handleBounds = fromHandleBounds?.[handleType];

  if (connectionMode === ConnectionMode.Loose) {
    handleBounds = handleBounds ? handleBounds : fromHandleBounds?.[handleType === 'source' ? 'target' : 'source'];
  }

  if (!fromNode || !handleBounds) {
    return null;
  }

  const fromHandle = handleId ? handleBounds.find((d) => d.id === handleId) : handleBounds[0];
  const fromHandleX = fromHandle ? fromHandle.x + fromHandle.width / 2 : (fromNode.width ?? 0) / 2;
  const fromHandleY = fromHandle ? fromHandle.y + fromHandle.height / 2 : fromNode.height ?? 0;
  const fromX = (fromNode.positionAbsolute?.x ?? 0) + fromHandleX;
  const fromY = (fromNode.positionAbsolute?.y ?? 0) + fromHandleY;
  const fromPosition = fromHandle?.position;
  const toPosition = fromPosition ? oppositePosition[fromPosition] : null;

  if (!fromPosition || !toPosition) {
    return null;
  }

  if (CustomComponent) {
    return (
      <CustomComponent
        connectionLineType={type}
        connectionLineStyle={style}
        fromNode={fromNode}
        fromHandle={fromHandle}
        fromX={fromX}
        fromY={fromY}
        toX={toX}
        toY={toY}
        fromPosition={fromPosition}
        toPosition={toPosition}
        connectionStatus={connectionStatus}
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
  nodeId: s.connectionNodeId,
  handleType: s.connectionHandleType,
  nodesConnectable: s.nodesConnectable,
  connectionStatus: s.connectionStatus,
  width: s.width,
  height: s.height,
});

function ConnectionLineWrapper({ containerStyle, style, type, component }: ConnectionLineWrapperProps) {
  const { nodeId, handleType, nodesConnectable, width, height, connectionStatus } = useStore(selector, shallow);
  const isValid = !!(nodeId && handleType && width && nodesConnectable);

  if (!isValid) {
    return null;
  }

  return (
    <svg
      style={containerStyle}
      width={width}
      height={height}
      className="react-flow__edges react-flow__connectionline react-flow__container"
    >
      <g className={cc(['react-flow__connection', connectionStatus])}>
        <ConnectionLine
          nodeId={nodeId}
          handleType={handleType}
          style={style}
          type={type}
          CustomComponent={component}
          connectionStatus={connectionStatus}
        />
      </g>
    </svg>
  );
}

export default ConnectionLineWrapper;
