import { useCallback } from 'react';

import ReactFlow, {
  addEdge,
  Background,
  OnLoadParams,
  EdgeTypesType,
  Connection,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';

import './style.css';

import FloatingEdge from './FloatingEdge';
import FloatingConnectionLine from './FloatingConnectionLine';
import { createElements } from './utils';

const onLoad = (reactFlowInstance: OnLoadParams) => reactFlowInstance.fitView();

const { nodes: initialNodes, edges: initialEdges } = createElements();

const edgeTypes: EdgeTypesType = {
  floating: FloatingEdge,
};

const FloatingEdges = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);

  return (
    <div className="floatingedges">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onLoad={onLoad}
        edgeTypes={edgeTypes}
        connectionLineComponent={FloatingConnectionLine}
      >
        <Background />
      </ReactFlow>
    </div>
  );
};

export default FloatingEdges;
