import { useCallback, useMemo, useState, type FC } from 'react';
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  MiniMap,
  reconnectEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
  type OnConnect,
  type ReactFlowProps,
  type Viewport,
} from '@xyflow/react';

import { baseEdges, baseNodes, type ReactFlowStoryArgs } from './config';
import { EVENT_HANDLER_ARG_NAMES, type EventHandlerArgName } from './eventHandlers';

const flowStyle = { width: '100%', height: '100%' } as const;

type EventHandlerProps = Pick<ReactFlowProps, EventHandlerArgName>;
type HandlerMap = Partial<Record<EventHandlerArgName, (...args: unknown[]) => unknown>>;

function pickEventHandlers(props: ReactFlowStoryArgs & Partial<EventHandlerProps>): HandlerMap {
  const handlers: HandlerMap = {};

  for (const key of EVENT_HANDLER_ARG_NAMES) {
    const handler = props[key];
    if (handler) {
      handlers[key] = handler as (...args: unknown[]) => unknown;
    }
  }

  return handlers;
}

function omitEventHandlers(props: ReactFlowStoryArgs & Partial<EventHandlerProps>): ReactFlowStoryArgs {
  const flowArgs = { ...props };

  for (const key of EVENT_HANDLER_ARG_NAMES) {
    delete flowArgs[key];
  }

  return flowArgs;
}

export const ReactFlowApiExample: FC<ReactFlowStoryArgs & Partial<EventHandlerProps>> = (props) => {
  const {
    useControlledViewport = false,
    viewport: viewportArg,
    defaultViewport,
    ariaLabelConfig,
    onConnect: onConnectAction,
    onReconnect: onReconnectAction,
    onNodesChange: onNodesChangeAction,
    onEdgesChange: onEdgesChangeAction,
    onViewportChange: onViewportChangeAction,
    onBeforeDelete: onBeforeDeleteAction,
    isValidConnection: isValidConnectionAction,
    ...rest
  } = props;

  const flowArgs = omitEventHandlers(rest);
  const eventHandlers = pickEventHandlers(props);

  const [nodes, , onNodesChange] = useNodesState([...baseNodes] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([...baseEdges] as Edge[]);
  const [viewport, setViewport] = useState<Viewport>(viewportArg ?? defaultViewport ?? { x: 0, y: 0, zoom: 1 });

  const onConnect: OnConnect = useCallback(
    (params) => {
      onConnectAction?.(params);
      setEdges((currentEdges) => addEdge(params, currentEdges));
    },
    [onConnectAction, setEdges]
  );

  const onReconnect = useCallback(
    (oldEdge: Edge, connection: Connection) => {
      onReconnectAction?.(oldEdge, connection);
      setEdges((currentEdges) => reconnectEdge(oldEdge, connection, currentEdges));
    },
    [onReconnectAction, setEdges]
  );

  const onNodesChangeWithAction = useCallback(
    (changes: Parameters<typeof onNodesChange>[0]) => {
      onNodesChangeAction?.(changes);
      onNodesChange(changes);
    },
    [onNodesChange, onNodesChangeAction]
  );

  const onEdgesChangeWithAction = useCallback(
    (changes: Parameters<typeof onEdgesChange>[0]) => {
      onEdgesChangeAction?.(changes);
      onEdgesChange(changes);
    },
    [onEdgesChange, onEdgesChangeAction]
  );

  const onViewportChange = useCallback(
    (nextViewport: Viewport) => {
      onViewportChangeAction?.(nextViewport);
      setViewport(nextViewport);
    },
    [onViewportChangeAction]
  );

  const onBeforeDelete = useCallback<NonNullable<ReactFlowProps['onBeforeDelete']>>(
    (params) => {
      if (!onBeforeDeleteAction) {
        return Promise.resolve(true);
      }

      return onBeforeDeleteAction(params);
    },
    [onBeforeDeleteAction]
  );

  const isValidConnection = useCallback<NonNullable<ReactFlowProps['isValidConnection']>>(
    (connection) => {
      if (isValidConnectionAction) {
        return isValidConnectionAction(connection);
      }

      return connection.source !== connection.target;
    },
    [isValidConnectionAction]
  );

  const wrapperStyle = useMemo(
    () => ({
      width: flowArgs.width ? `${flowArgs.width}px` : '100%',
      height: flowArgs.height ? `${flowArgs.height}px` : '100%',
      minHeight: flowArgs.height ? undefined : '100%',
    }),
    [flowArgs.height, flowArgs.width]
  );

  const wrappedHandlers: Partial<ReactFlowProps> = {
    ...(eventHandlers as Partial<ReactFlowProps>),
    onConnect,
    onReconnect,
    onNodesChange: onNodesChangeWithAction,
    onEdgesChange: onEdgesChangeWithAction,
    onBeforeDelete,
    isValidConnection,
    ...(useControlledViewport || onViewportChangeAction ? { onViewportChange } : {}),
  };

  return (
    <div style={wrapperStyle}>
      <ReactFlow
        style={flowStyle}
        {...flowArgs}
        nodes={nodes}
        edges={edges}
        ariaLabelConfig={ariaLabelConfig}
        {...wrappedHandlers}
        {...(useControlledViewport
          ? {
              viewport,
              onViewportChange,
              fitView: false,
            }
          : {
              defaultViewport,
            })}
      >
        <MiniMap />
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default ReactFlowApiExample;
