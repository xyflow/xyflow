import { useEffect, useMemo, type FC } from 'react';
import {
  Background,
  BackgroundVariant,
  NodeToolbar,
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  type Node,
} from '@xyflow/react';

import ToolbarNode from './ToolbarNode';
import { DEMO_NODE_ID, demoNode, type NodeToolbarStoryArgs } from './config';

const flowStyle = { width: '100%', height: '100%' } as const;

function createNodes(args: NodeToolbarStoryArgs) {
  return [{ ...demoNode(args), className: 'react-flow__node-default' }] as Node[];
}

export const NodeToolbarExample: FC<NodeToolbarStoryArgs> = ({
  isVisible,
  position,
  offset,
  align,
  nodeId,
  renderMode = 'inside-node',
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    createNodes({ isVisible, position, offset, align, renderMode })
  );
  const nodeTypes = useMemo(() => ({ ToolbarNode }), []);
  const externalNodeId = nodeId || DEMO_NODE_ID;
  const showExternalToolbar = renderMode === 'external';

  useEffect(() => {
    setNodes(createNodes({ isVisible, position, offset, align, renderMode }));
  }, [align, isVisible, offset, position, renderMode, setNodes]);

  return (
    <ReactFlowProvider>
      <div style={flowStyle}>
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          fitView
          minZoom={0.5}
          maxZoom={2}
        >
          <Background variant={BackgroundVariant.Dots} />
          {showExternalToolbar ? (
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
