import { Handle, Position, NodeProps } from 'react-flow-renderer';

const CustomNode = ({ data }: NodeProps) => {
  const handleType = data?.isTarget ? 'target' : 'source';

  return (
    <div className="customnode">
      This is a node
      <div className="handlewrapper">
        <Handle type={handleType} position={Position.Top} />
      </div>
    </div>
  );
};

export default CustomNode;
