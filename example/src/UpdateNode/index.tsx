import { useEffect, useState } from 'react';
import ReactFlow, { Node, Edge, useNodesState, useEdgesState } from 'react-flow-renderer';

import './updatenode.css';

const initialNodes: Node[] = [
  { id: '1', data: { label: '-' }, position: { x: 100, y: 100 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 200 } },
];

const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2' }];

const UpdateNode = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [nodeName, setNodeName] = useState<string>('Node 1');
  const [nodeBg, setNodeBg] = useState<string>('#eee');
  const [nodeHidden, setNodeHidden] = useState<boolean>(false);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === '1') {
          // it's important that you create a new object here in order to notify react flow about the change
          n.data = {
            ...n.data,
            label: nodeName,
          };
        }

        return n;
      })
    );
  }, [nodeName]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === '1') {
          // it's important that you create a new object here in order to notify react flow about the change
          n.style = { ...n.style, backgroundColor: nodeBg };
        }

        return n;
      })
    );
  }, [nodeBg]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === '1' || n.id === 'e1-2') {
          // when you update a simple type you can just update the value
          n.hidden = nodeHidden;
        }

        return n;
      })
    );
  }, [nodeHidden]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      defaultZoom={1.5}
      minZoom={0.2}
      maxZoom={4}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
    >
      <div className="updatenode__controls">
        <label>label:</label>
        <input value={nodeName} onChange={(evt) => setNodeName(evt.target.value)} />

        <label className="updatenode__bglabel">background:</label>
        <input value={nodeBg} onChange={(evt) => setNodeBg(evt.target.value)} />

        <div className="updatenode__checkboxwrapper">
          <label>hidden:</label>
          <input type="checkbox" checked={nodeHidden} onChange={(evt) => setNodeHidden(evt.target.checked)} />
        </div>
      </div>
    </ReactFlow>
  );
};

export default UpdateNode;
