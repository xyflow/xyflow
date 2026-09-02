import { FC } from 'react';

import { ReactFlow, ReactFlowProvider, useNodesState, Background, type Node } from '@xyflow/react';

import { initialNodes, type SharedBackgroundArgs } from './config';

const flowStyle = { width: '100%', height: '100%' } as const;

export const BackgroundExample: FC<SharedBackgroundArgs> = ({ id = 'background', ...backgroundProps }) => {
  const [nodes, , onNodesChange] = useNodesState([...initialNodes] as Node[]);

  return (
    <ReactFlowProvider>
      <div style={flowStyle}>
        <ReactFlow nodes={nodes} onNodesChange={onNodesChange} style={flowStyle}>
          <Background id={id} {...backgroundProps} />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
};

export default BackgroundExample;
