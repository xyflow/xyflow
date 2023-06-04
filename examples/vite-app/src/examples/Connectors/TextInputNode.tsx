import { useState } from 'react';
import { NodeProps } from 'reactflow';
import { OutputConnector } from './connectors';

const TextInputNode = ({ data }: NodeProps) => {
  const [value, setValue] = useState('');

  return (
    <div className="react-flow__node-default">
      <input type="text" value={value} onChange={(evt) => setValue(evt.target.value)} />
      <OutputConnector id="text-output" value={value} />
    </div>
  );
};

export default TextInputNode;
