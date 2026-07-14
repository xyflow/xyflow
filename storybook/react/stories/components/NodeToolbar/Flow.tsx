import { useMemo, type FC } from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  NodeToolbar,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';

import DemoToolbarNode from './DemoToolbarNode';
import { type NodeToolbarStoryArgs } from './config';

const flowStyle = { width: '100%', height: '100%' } as const;
const DEMO_NODE_ID = 'demo-node';

type NodeToolbarExampleProps = NodeToolbarStoryArgs;

export const NodeToolbarExample: FC<NodeToolbarExampleProps> = ({
  isVisible,
  position,
  offset,
  align,
  nodeId,
  renderMode = 'inside-node',
}) => {
  const nodes = useMemo(
    () => [
      {
        id: DEMO_NODE_ID,
        type: 'DemoToolbarNode',
        position: { x: 250, y: 200 },
        data: {
          label: 'Select or interact with this node',
          isVisible,
          position,
          offset,
          align,
          renderMode,
        },
      },
    ],
    [align, isVisible, offset, position, renderMode]
  );

  const nodeTypes = useMemo(() => ({ DemoToolbarNode }), []);
  const [flowNodes, , onNodesChange] = useNodesState(nodes);
  const [edges, , onEdgesChange] = useEdgesState([]);

  const externalNodeId = nodeId || DEMO_NODE_ID;

  return (
    <ReactFlowProvider>
      <div style={flowStyle}>
        <ReactFlow
          nodes={flowNodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          minZoom={0.5}
          maxZoom={2}
        >
          <Background variant={BackgroundVariant.Dots} />
          <MiniMap />
          <Controls />
          {renderMode === 'external' ? (
            <NodeToolbar nodeId={externalNodeId} isVisible={isVisible} position={position} offset={offset} align={align}>
              <button type="button">delete</button>
              <button type="button">copy</button>
              <button type="button">expand</button>
            </NodeToolbar>
          ) : null}
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

export default NodeToolbarExample;
