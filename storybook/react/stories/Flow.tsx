import { useCallback, useEffect, useMemo, useState } from 'react';
import { ReactFlow, addEdge, useEdgesState, useNodesState, type NodeTypes, type OnConnect } from '@xyflow/react';

import { FLOW_STORY_RESET_EVENT } from '../../shared/tests/suite';
import type { SharedFlowConfig } from 'storybook-shared/types';

type FlowProps = {
  flowConfig: SharedFlowConfig;
  nodeTypes?: NodeTypes;
};

export function Flow({ flowConfig, nodeTypes }: FlowProps) {
  const initialNodes = useMemo(() => flowConfig.flowProps?.nodes ?? [], [flowConfig]);
  const initialEdges = useMemo(() => flowConfig.flowProps?.edges ?? [], [flowConfig]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [resetKey, setResetKey] = useState(0);
  const props = { ...flowConfig.flowProps, nodes, edges, nodeTypes };

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
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        key={resetKey}
        {...props}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      />
    </div>
  );
}
