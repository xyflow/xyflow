import { useState } from 'react';
import { NodeProps } from 'reactflow';
import { InputConnector, ConnectorStoreItem, OutputConnector } from './connectors';

const TextTranslateNode = ({ data }: NodeProps) => {
  const [value, setValue] = useState<ConnectorStoreItem>({ value: undefined, type: 'undefined' });

  const onChange = (item: ConnectorStoreItem) => {
    setValue(item);
  };

  console.log(value);

  return (
    <div className="react-flow__node-default">
      <InputConnector id="debug-input" onChange={onChange} />
      <OutputConnector id="debug-output" value={value?.value} valueType={value?.type} />
      <div>{JSON.stringify(value)}</div>
    </div>
  );
};

export default TextTranslateNode;
