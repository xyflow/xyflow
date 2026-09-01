import { useCallback, useEffect, useMemo, useState, type FC } from 'react';
import {
  Background,
  BackgroundVariant,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  type MiniMapProps,
  type OnConnect,
} from '@xyflow/react';

import { defaultFlowProps } from '../defaultFlow';
import { FLOW_STORY_RESET_EVENT } from '../../tests/suite';

import { type MiniMapStoryArgs } from './config';

const flowStyle = { width: '100%', height: '100%' } as const;

type MiniMapExampleProps = MiniMapStoryArgs &
  Pick<MiniMapProps, 'onClick' | 'onNodeClick'>;

export const MiniMapExample: FC<MiniMapExampleProps> = ({
  className,
  style,
  onClick,
  onNodeClick,
  ...miniMapProps
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
          <MiniMap
            {...miniMapProps}
            className={className}
            style={style}
            onClick={onClick}
            onNodeClick={onNodeClick}
          />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

export default MiniMapExample;
