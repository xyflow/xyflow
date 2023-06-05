import { memo, FC } from 'react';
import { Handle, Position, NodeProps, Connection, Edge } from '@xyflow/react';

const onConnect = (params: Connection | Edge) => console.log('handle onConnect', params);

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
};

const dragHandleStyle = {
  display: 'inline-block',
  width: 25,
  height: 25,
  backgroundColor: 'teal',
  marginLeft: 5,
  borderRadius: '50%',
};

const ColorSelectorNode: FC<NodeProps> = () => {
  return (
    <>
      <Handle type="target" position={Position.Left} onConnect={onConnect} />
      <div style={labelStyle}>
        Only draggable here → <span className="custom-drag-handle" style={dragHandleStyle} />
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default memo(ColorSelectorNode);
