import { useCallback, useMemo, type FC } from 'react';
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

import { basicAddonsConfig } from 'storybook-shared/flow-configs/basic-addons';

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
