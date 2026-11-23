import { useRef } from 'react';
import { useNodesData, useReactFlow } from '@xyflow/react';

export default function NodesDataUpdatesNode() {
  const { setNodes, updateNodeData } = useReactFlow();
  const node = useNodesData('a');
  const nodes = useNodesData(['a', 'b']);
  const renders = useRef(0);
  renders.current++;

  return (
    <div className="nodrag nopan">
      <output data-testid="data-renders">{renders.current}</output>
      <output data-testid="node-data">{String(node?.data.value ?? 'missing')}</output>
      <output data-testid="nodes-data">
        {nodes.map(({ id, data }) => `${id}:${String(data.value ?? '')}`).join(',')}
      </output>
      <button
        onClick={() =>
          setNodes((nodes) =>
            nodes.map((node) =>
              node.id === 'a' ? { ...node, position: { x: node.position.x + 10, y: node.position.y } } : node
            )
          )
        }
      >
        Move observed node
      </button>
      <button
        onClick={() =>
          setNodes((nodes) => nodes.map((node) => (node.id === 'a' ? { ...node, selected: !node.selected } : node)))
        }
      >
        Select observed node
      </button>
      <button onClick={() => updateNodeData('a', { value: 'updated' })}>Update observed data</button>
    </div>
  );
}
