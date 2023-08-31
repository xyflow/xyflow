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

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
  },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
  { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 } },
  { id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 200 } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
];

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
            nodes={nodes}
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
