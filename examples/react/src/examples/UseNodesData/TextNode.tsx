import { memo, ChangeEventHandler } from 'react';
import { Position, NodeProps, Handle, useReactFlow } from '@xyflow/react';

function TextNode({ id, data }: NodeProps) {
  const { updateNodeData } = useReactFlow();

  const onChange: ChangeEventHandler<HTMLInputElement> = (evt) => updateNodeData(id, { text: evt.target.value });

  return (
    <div style={{ background: '#eee', color: '#222', padding: 10, fontSize: 12, borderRadius: 10 }}>
      <div>node {id}</div>
      <div>
        <input onChange={onChange} value={data.text} />
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default memo(TextNode);
