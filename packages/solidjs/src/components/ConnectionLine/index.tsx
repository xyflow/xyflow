// import { CSSProperties, useCallback } from 'react';
// import { shallow } from 'zustand/shallow';
import cc from 'classcat';
import {
  ConnectionLineType,
  getBezierPath,
  getSmoothStepPath,
  getConnectionStatus,
  getStraightPath,
} from '@xyflow/system';

import { useStore } from '../../hooks/useStore';
import { getSimpleBezierPath } from '../Edges/SimpleBezierEdge';
import type { ConnectionLineComponent, SolidFlowState, Node } from '../../types';
import { Show, mergeProps, JSX } from 'solid-js';
import { useConnection } from '../../hooks/useConnection';

type ConnectionLineWrapperProps<NodeType extends Node = Node> = {
  type: ConnectionLineType;
  component?: ConnectionLineComponent<NodeType>;
  containerStyle?: JSX.CSSProperties;
  style?: JSX.CSSProperties;
};

const selector = (s: SolidFlowState) => ({
  nodesConnectable: () => s.nodesConnectable.get(),
  isValid: () => s.connection.get().isValid,
  inProgress: () => s.connection.get().inProgress,
  width: s.width,
  height: s.height,
});

export function ConnectionLineWrapper<NodeType extends Node = Node>(p: ConnectionLineWrapperProps<NodeType>) {
  const storeData = useStore(selector);
  const renderConnection = () => !!(storeData.width.get() && storeData.nodesConnectable() && storeData.inProgress());

  return (
    <Show when={renderConnection()}>
      <svg
        style={p.containerStyle}
        width={storeData.width.get()}
        height={storeData.height.get()}
        class="react-flow__connectionline react-flow__container"
      >
        <g class={cc(['react-flow__connection', getConnectionStatus(storeData.isValid())])}>
          <ConnectionLine<NodeType>
            style={p.style}
            type={p.type}
            CustomComponent={p.component}
            isValid={storeData.isValid()}
          />
        </g>
      </svg>
    </Show>
  );
}

type ConnectionLineProps<NodeType extends Node = Node> = {
  type: ConnectionLineType;
  style?: JSX.CSSProperties;
  CustomComponent?: ConnectionLineComponent<NodeType>;
  isValid: boolean | null;
};

const ConnectionLine = <NodeType extends Node = Node>(_p: ConnectionLineProps<NodeType>) => {
  const p = mergeProps({ type: ConnectionLineType.Bezier }, _p);
  const connection = useConnection();

  // Destructure the connection values for easier access, similar to React
  const inProgress = () => connection().inProgress;
  const from = () => connection().from;
  const fromNode = () => connection().fromNode;
  const fromHandle = () => connection().fromHandle;
  const fromPosition = () => connection().fromPosition;
  const to = () => connection().to;
  const toNode = () => connection().toNode;
  const toHandle = () => connection().toHandle;
  const toPosition = () => connection().toPosition;

  return (
    <Show when={inProgress()}>
      <Show when={p.CustomComponent} keyed fallback={<DefaultComponent />}>
        {(Comp) => {
          return (
            <Comp
              connectionLineType={p.type}
              connectionLineStyle={p.style}
              fromNode={fromNode()! as any}
              fromHandle={fromHandle()!}
              fromX={from()!.x}
              fromY={from()!.y}
              toX={to()!.x}
              toY={to()!.y}
              fromPosition={fromPosition()!}
              toPosition={toPosition()!}
              connectionStatus={getConnectionStatus(p.isValid)}
              toNode={toNode() as any}
              toHandle={toHandle()}
            />
          );
        }}
      </Show>
    </Show>
  );

  function DefaultComponent() {
    if (!inProgress()) return null;

    const makePath = () => {
      let path = '';

      const pathParams = {
        sourceX: from()!.x,
        sourceY: from()!.y,
        sourcePosition: fromPosition()!,
        targetX: to()!.x,
        targetY: to()!.y,
        targetPosition: toPosition()!,
      };

      switch (p.type) {
        case ConnectionLineType.Bezier:
          [path] = getBezierPath(pathParams);
          break;
        case ConnectionLineType.SimpleBezier:
          [path] = getSimpleBezierPath(pathParams);
          break;
        case ConnectionLineType.Step:
          [path] = getSmoothStepPath({
            ...pathParams,
            borderRadius: 0,
          });
          break;
        case ConnectionLineType.SmoothStep:
          [path] = getSmoothStepPath(pathParams);
          break;
        default:
          [path] = getStraightPath(pathParams);
      }
      return path;
    };

    return <path d={makePath()} fill="none" class="react-flow__connection-path" style={p.style} />;
  }
};

ConnectionLine.displayName = 'ConnectionLine';
