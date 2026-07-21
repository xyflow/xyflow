import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  type OnConnect,
} from '@xyflow/react';

import { basicAddonsConfig } from '../AddonsTestFlow/config';
import { FLOW_STORY_RESET_EVENT } from 'storybook-shared/play-helpers/suite';

const flowStyle = { width: '100%', height: '100%' } as const;

export default function AddonsTestFlow() {
  const initialNodes = useMemo(() => basicAddonsConfig.flowProps?.nodes ?? [], []);
  const initialEdges = useMemo(() => basicAddonsConfig.flowProps?.edges ?? [], []);
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
    <div style={flowStyle}>
      <ReactFlow
        key={resetKey}
        {...basicAddonsConfig.flowProps}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Background variant={BackgroundVariant.Dots} />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
