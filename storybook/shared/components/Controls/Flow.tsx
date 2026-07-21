import { useCallback, useMemo, type FC } from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  type ControlProps,
  type OnConnect,
} from '@xyflow/react';

import { basicAddonsConfig } from '../AddonsTestFlow/config';

import { type ControlsStoryArgs } from './config';

const flowStyle = { width: '100%', height: '100%' } as const;

type ControlsExampleProps = ControlsStoryArgs &
  Pick<ControlProps, 'onZoomIn' | 'onZoomOut' | 'onFitView' | 'onInteractiveChange'>;

export const ControlsExample: FC<ControlsExampleProps> = ({
  className,
  style,
  fitViewOptions,
  showInteractive,
  onZoomIn,
  onZoomOut,
  onFitView,
  onInteractiveChange,
  ...controlsProps
}) => {
  const initialNodes = useMemo(() => basicAddonsConfig.flowProps?.nodes ?? [], []);
  const initialEdges = useMemo(() => basicAddonsConfig.flowProps?.edges ?? [], []);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((currentEdges) => addEdge(params, currentEdges)),
    [setEdges]
  );

  return (
    <ReactFlowProvider>
      <div style={flowStyle}>
        <ReactFlow
          {...basicAddonsConfig.flowProps}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        >
          <Background variant={BackgroundVariant.Dots} />
          <Controls
            {...controlsProps}
            className={className}
            style={style}
            fitViewOptions={fitViewOptions}
            showInteractive={showInteractive}
            onZoomIn={onZoomIn}
            onZoomOut={onZoomOut}
            onFitView={onFitView}
            onInteractiveChange={onInteractiveChange}
          />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

export default ControlsExample;
