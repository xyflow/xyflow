import { useCallback, useEffect, useMemo, useState } from 'react';
import { ReactFlow, addEdge, useEdgesState, useNodesState, type NodeTypes, type OnConnect } from '@xyflow/react';

import { nodeToolbarReactConfig } from 'storybook-shared/flow-configs/node-toolbar-general';
import { FLOW_STORY_RESET_EVENT } from 'storybook-shared/play-helpers/suite';

import ToolbarNode from 'storybook-component-toolbar-node';

const flowStyle = { width: '100%', height: '100%' } as const;
const nodeTypes: NodeTypes = { ToolbarNode };

export default function NodeToolbarTestFlow() {
  const initialNodes = useMemo(() => nodeToolbarReactConfig.flowProps?.nodes ?? [], []);
  const initialEdges = useMemo(() => nodeToolbarReactConfig.flowProps?.edges ?? [], []);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [resetKey, setResetKey] = useState(0);
  const props = { ...nodeToolbarReactConfig.flowProps, nodes, edges, nodeTypes };

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
        {...props}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      />
    </div>
  );
}
