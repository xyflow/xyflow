import { useCallback, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from '@xyflow/react';

import type { SharedFlowConfig } from 'storybook-shared/types';

type FlowStoryProps = {
  flowConfig: SharedFlowConfig;
};

export function FlowStory({ flowConfig }: FlowStoryProps) {
  const [nodes, setNodes] = useState(flowConfig.flowProps?.nodes ?? []);
  const [edges, setEdges] = useState(flowConfig.flowProps?.edges ?? []);
  const props = { ...flowConfig.flowProps, nodes, edges };

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((currentNodes) => applyNodeChanges(changes, currentNodes)),
    []
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((currentEdges) => applyEdgeChanges(changes, currentEdges)),
    []
  );
  const onConnect: OnConnect = useCallback((params) => setEdges((currentEdges) => addEdge(params, currentEdges)), []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow {...props} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} />
    </div>
  );
}
