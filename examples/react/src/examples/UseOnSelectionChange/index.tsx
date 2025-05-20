import { useCallback, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  ReactFlowProvider,
  Node,
  Connection,
  Edge,
  useNodesState,
  useEdgesState,
  useOnSelectionChange,
  OnSelectionChangeParams,
  Panel,
} from '@xyflow/react';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    type: 'default',
    data: { label: 'Node 2' },
    position: { x: 250, y: 100 },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
  },
];

const SelectionLogger = ({ id }: { id: string }) => {
  const onChange = useCallback(({ nodes, edges }: OnSelectionChangeParams) => {
    console.log(id, nodes, edges);
  }, []);

  useOnSelectionChange({
    onChange,
  });

  return null;
};

const Flow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback((params: Edge | Connection) => setEdges((els) => addEdge(params, els)), [setEdges]);
  const [elementsSelectable, setElementsSelectable] = useState<boolean>(true);
  const [secondLoggerActive, setSecondLoggerActive] = useState<boolean>(true);

  const toggleSecondLogger = () => {
    setSecondLoggerActive(!secondLoggerActive);
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      elementsSelectable={elementsSelectable}
    >
      <Panel>
        <button onClick={toggleSecondLogger}>{secondLoggerActive ? 'Disable' : 'Enable'} Logger 2</button>
        <button onClick={() => setElementsSelectable((s) => !s)}>toggle selectable</button>
      </Panel>

      <SelectionLogger id="Logger 1" />
      {secondLoggerActive && <SelectionLogger id="Logger 2" />}
    </ReactFlow>
  );
};

export default Flow;
