import { useCallback, useEffect, useMemo, useState, type FC } from 'react';
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

import { defaultFlowProps } from '../defaultFlow';
import { FLOW_STORY_RESET_EVENT } from '../../tests/suite';

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
  const initialNodes = useMemo(() => defaultFlowProps.nodes ?? [], []);
  const initialEdges = useMemo(() => defaultFlowProps.edges ?? [], []);
  const [resetKey, setResetKey] = useState(0);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((currentEdges) => addEdge(params, currentEdges)),
    [setEdges]
  );

  useEffect(() => {
    const reset = () => {
      setNodes(initialNodes);
      setEdges(initialEdges);
      setResetKey((key) => key + 1);
    };

    window.addEventListener(FLOW_STORY_RESET_EVENT, reset);
    return () => window.removeEventListener(FLOW_STORY_RESET_EVENT, reset);
  }, [initialEdges, initialNodes, setEdges, setNodes]);

  return (
    <ReactFlowProvider key={resetKey}>
      <div style={flowStyle}>
        <ReactFlow
          {...defaultFlowProps}
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
