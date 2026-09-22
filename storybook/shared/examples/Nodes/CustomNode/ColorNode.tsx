import { Handle, Position, useReactFlow, type Node, type NodeProps } from '@xyflow/react';
export default function ColorNode({ id, data }: NodeProps<Node<{ color: string }>>) {
  const { updateNodeData } = useReactFlow();
  return (
    <div style={{ background: 'white', color: '#222', padding: 12, border: '1px solid #777', borderRadius: 8 }}>
      <Handle type="target" position={Position.Top} />
      <label>
        Node color{' '}
        <input
          aria-label="Node color"
          className="nodrag nokey"
          type="color"
          value={data.color}
          onChange={(event) => updateNodeData(id, { color: event.currentTarget.value })}
        />
      </label>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
