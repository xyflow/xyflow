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

import { FLOW_STORY_RESET_EVENT } from '../../tests/suite';
import { defaultFlowProps } from '../defaultFlow';
import type { SharedControlsArgs } from './config';

type ControlsExampleProps = SharedControlsArgs &
  Pick<ControlProps, 'onZoomIn' | 'onZoomOut' | 'onFitView' | 'onInteractiveChange'>;

const flowStyle = { width: '100%', height: '100%' } as const;

export const ControlsExample: FC<ControlsExampleProps> = (controlsProps) => {
  const initialNodes = useMemo(() => defaultFlowProps.nodes ?? [], []);
  const initialEdges = useMemo(() => defaultFlowProps.edges ?? [], []);
  const [resetKey, setResetKey] = useState(0);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((currentEdges) => addEdge(connection, currentEdges)),
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
          <Controls {...controlsProps} />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

export default ControlsExample;
