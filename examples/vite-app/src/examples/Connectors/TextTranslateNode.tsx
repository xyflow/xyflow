import { useState } from 'react';
import { NodeProps } from 'reactflow';
import { InputConnector, ConnectorStoreItem } from './connectors';

const reverseString = (text: string) => {
  return text.split('').reverse().join('');
};

const TextTranslateNode = ({ data }: NodeProps) => {
  const [value, setValue] = useState<undefined | string>(undefined);

  const onChange = (item: ConnectorStoreItem) => {
    if (item && item.value && typeof item.value === 'string') {
      setValue(reverseString(item.value));
    } else {
      setValue(undefined);
    }
  };

  return (
    <div className="react-flow__node-default">
      <InputConnector id="text-input" onChange={onChange} />
      {typeof value === 'string' ? <div>{value}</div> : <div>no input</div>}
    </div>
  );
};

export default TextTranslateNode;
