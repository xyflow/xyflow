import { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';

function CustomNode() {
  const [text, setText] = useState('this is a pretty long text');

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div style={{ background: '#eee', padding: 10 }}>
        <div>
          <input value={text} onChange={(e) => setText(e.target.value)} />
          <div>text: {text}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}

export default memo(CustomNode);
