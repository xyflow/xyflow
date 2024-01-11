import { memo, useState } from 'react';
import { Position, NodeProps, Handle, useReactFlow } from '@xyflow/react';

function TextNode({ id, data }: NodeProps) {
  const { updateNodeData } = useReactFlow();
  const [text, setText] = useState(data.text);
  const updateText = (text: string) => {
    // avoid jumping caret with a synchronous update
    setText(text);
    // update actual node data
    updateNodeData(id, { text });
  };

  return (
    <div style={{ background: '#eee', color: '#222', padding: 10, fontSize: 12, borderRadius: 10 }}>
      <div>node {id}</div>
      <div>
        <input onChange={(evt) => updateText(evt.target.value)} value={text} />
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default memo(TextNode);
