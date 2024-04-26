// import { CSSProperties, useCallback } from 'react';
// import { shallow } from 'zustand/shallow';
import cc from 'classcat';
import {
  Position,
  ConnectionLineType,
  ConnectionMode,
  getBezierPath,
  getSmoothStepPath,
  type ConnectionStatus,
  type HandleType,
} from '@xyflow/system';

import { useStore } from '../../hooks/useStore';
import { getSimpleBezierPath } from '../Edges/SimpleBezierEdge';
import type { ConnectionLineComponent, SolidFlowState, SolidFlowStore } from '../../types';
import { Show, mergeProps, JSX } from 'solid-js';

type ConnectionLineProps = {
  nodeId: string;
  handleType: HandleType;
  type: ConnectionLineType;
  style?: JSX.CSSProperties;
  CustomComponent?: ConnectionLineComponent;
  connectionStatus: ConnectionStatus | null;
};

const oppositePosition = {
  [Position.Left]: Position.Right,
  [Position.Right]: Position.Left,
  [Position.Top]: Position.Bottom,
  [Position.Bottom]: Position.Top,
};

const ConnectionLine = (_p: ConnectionLineProps) => {
  //   nodeId,
  //   handleType,
  //   style,
  //   type = ConnectionLineType.Bezier,
  //   CustomComponent,
  //   connectionStatus,
  // }: ConnectionLineProps) => {
  const p = mergeProps({ type: ConnectionLineType.Bezier }, _p);

  const { fromNode, handleId, toX, toY, connectionMode } = useStore((s: SolidFlowStore) => ({
    fromNode: s.nodeLookup.get(p.nodeId),
    handleId: s.connectionStartHandle.get()?.handleId,
    toX: () => (s.connectionPosition.get().x - s.transform.get()[0]) / s.transform.get()[2],
    toY: () => (s.connectionPosition.get().y - s.transform.get()[1]) / s.transform.get()[2],
    connectionMode: s.connectionMode,
  }));
  // p.shallow
  const fromHandleBounds = () => fromNode?.internals.handleBounds;
  const handleBounds = () => {
    const x = fromHandleBounds()?.[p.handleType];
    if (connectionMode.get() === ConnectionMode.Loose) {
      return x ? x : fromHandleBounds()?.[p.handleType === 'source' ? 'target' : 'source'];
    } else {
      return x;
    }
  };

  // if (connectionMode === ConnectionMode.Loose) {
  //   handleBounds = handleBounds() ? handleBounds : fromHandleBounds?.[handleType === 'source' ? 'target' : 'source'];
  // }

  // if (!fromNode || !handleBounds) {
  //   return null;
  // }

  const fromHandle = () => (handleId ? handleBounds()?.find((d) => d.id === handleId) : handleBounds()?.[0]);
  const fromHandleX = () => {
    const handle = fromHandle();
    if (handle) {
      return handle.x + handle.width / 2;
    } else {
      return fromNode?.measured.width ?? 0 / 2;
    }
  };
  const fromHandleY = () => {
    const handle = fromHandle();
    if (handle) {
      return handle.y + handle.height / 2;
    } else {
      return fromNode?.measured.height ?? 0 / 2;
    }
  };
  const fromX = () => fromNode?.internals?.positionAbsolute?.x || 0 + fromHandleX();
  const fromY = () => fromNode?.internals?.positionAbsolute?.y || 0 + fromHandleY();
  const fromPosition = () => fromHandle()?.position;
  const toPosition = () => (fromPosition() ? oppositePosition[fromPosition()!] : null);


  const DefaultComponent = () => {
    const makeDAttr = () => {
      let dAttr = '';

      const pathParams = {
        sourceX: fromX(),
        sourceY: fromY(),
        sourcePosition: fromPosition()!,
        targetX: toX(),
        targetY: toY(),
        targetPosition: toPosition()!,
      };

      if (p.type === ConnectionLineType.Bezier) {
        // we assume the destination position is opposite to the source position
        [dAttr] = getBezierPath(pathParams);
      } else if (p.type === ConnectionLineType.Step) {
        [dAttr] = getSmoothStepPath({
          ...pathParams,
          borderRadius: 0,
        });
      } else if (p.type === ConnectionLineType.SmoothStep) {
        [dAttr] = getSmoothStepPath(pathParams);
      } else if (p.type === ConnectionLineType.SimpleBezier) {
        [dAttr] = getSimpleBezierPath(pathParams);
      } else {
        dAttr = `M${fromX()},${fromY()} ${toX},${toY}`;
      }

      return dAttr;
    };

    return <path d={makeDAttr()} fill="none" class="react-flow__connection-path" style={p.style} />;
  };

  return (
    <Show when={fromNode && handleBounds() && fromPosition() && toPosition()}>
      <Show when={p.CustomComponent} keyed fallback={<DefaultComponent />}>
        {(Comp) => {
          return (
            <Comp
              connectionLineType={p.type}
              connectionLineStyle={p.style}
              fromNode={fromNode}
              fromHandle={fromHandle()}
              fromX={fromX()}
              fromY={fromY()}
              toX={toX()}
              toY={toY()}
              fromPosition={fromPosition()!}
              toPosition={toPosition()!}
              connectionStatus={p.connectionStatus}
            />
          );
        }}
      </Show>
    </Show>
  );

  // if (CustomComponent) {
  //   return (
  //     <CustomComponent
  //       connectionLineType={type}
  //       connectionLineStyle={style}
  //       fromNode={fromNode}
  //       fromHandle={fromHandle}
  //       fromX={fromX}
  //       fromY={fromY}
  //       toX={toX}
  //       toY={toY}
  //       fromPosition={fromPosition}
  //       toPosition={toPosition}
  //       connectionStatus={connectionStatus}
  //     />
  //   );
  // }
};

ConnectionLine.displayName = 'ConnectionLine';

type ConnectionLineWrapperProps = {
  type: ConnectionLineType;
  component?: ConnectionLineComponent;
  containerStyle?: JSX.CSSProperties;
  style?: JSX.CSSProperties;
};

const selector = (s: SolidFlowState) => ({
  nodeId: () => s.connectionStartHandle.get()?.nodeId,
  handleType: () => s.connectionStartHandle.get()?.type,
  nodesConnectable: () => s.nodesConnectable.get(),
  connectionStatus: () => s.connectionStatus.get(),
  width: s.width,
  height: s.height,
});

export function ConnectionLineWrapper(p: ConnectionLineWrapperProps) {
  // { containerStyle, style, type, component }: ConnectionLineWrapperProps) {

  const { nodeId, handleType, nodesConnectable, width, height, connectionStatus } = useStore(selector);

  const innerProps = () => {
    const nId = nodeId();
    const hType = handleType();
    const isValid = !!(nId && hType && width.get() && nodesConnectable());
    if (!isValid) {
      return null;
    }
    return {
      nodeId: nId,
      handleType: hType,
      type: p.type,
      style: p.style,
      CustomComponent: p.component,
      connectionStatus: connectionStatus(),
    };
  };

  return (
    <Show when={innerProps()}>
      {(props) => {
        return (
          <svg
            style={p.containerStyle}
            width={width.get()}
            height={height.get()}
            class="react-flow__connectionline react-flow__container"
          >
            <g class={cc(['react-flow__connection', connectionStatus])}>
              <ConnectionLine
                nodeId={props().nodeId}
                handleType={props().handleType}
                style={props().style}
                type={props().type}
                CustomComponent={props().CustomComponent}
                connectionStatus={props().connectionStatus}
              />
            </g>
          </svg>
        );
      }}
    </Show>
  );
}
