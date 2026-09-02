import { MouseEvent, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  ReactFlowProvider,
  addEdge,
  Node,
  Connection,
  Edge,
  ConnectionMode,
  useNodesState,
  useEdgesState,
  ReactFlowInstance,
} from '@xyflow/react';

import Sidebar from './Sidebar';

import styles from './provider.module.css';

const onNodeClick = (_: MouseEvent, node: Node) => console.log('click', node);
const onInit = (reactFlowInstance: ReactFlowInstance) => console.log('pane ready:', reactFlowInstance);

import { defaultFlowProps } from '@shared/defaultFlow';

const { nodes: initialNodes = [], edges: initialEdges = [], fitViewOptions } = defaultFlowProps;

const ProviderFlow = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback((params: Edge | Connection) => setEdges((els) => addEdge(params, els)), [setEdges]);

  return (
    <div className={styles.providerflow}>
      <ReactFlowProvider>
        <Sidebar />
        <div className={styles.wrapper}>
          <ReactFlow
            defaultNodes={initialNodes}
            defaultEdges={initialEdges}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onConnect={onConnect}
            onInit={onInit}
            connectionMode={ConnectionMode.Loose}
          >
            <Controls />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default ProviderFlow;
