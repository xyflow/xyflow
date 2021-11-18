import React, { memo, FC, CSSProperties } from 'react';

import { Handle, Position, NodeProps, Connection, Edge } from 'react-flow-renderer';

const targetHandleStyle: CSSProperties = { background: '#555' };
const sourceHandleStyleA: CSSProperties = { ...targetHandleStyle, top: 10 };
const sourceHandleStyleB: CSSProperties = { ...targetHandleStyle, bottom: 10, top: 'auto' };

const onConnect = (params: Connection | Edge) => console.log('handle onConnect', params);

const ColorSelectorNode: FC<NodeProps> = ({ data, isConnectable }) => {
  return (
    <>
      <Handle type="target" position={Position.Left} style={targetHandleStyle} onConnect={onConnect} />
      <div>
        Custom Color Picker Node: <strong>{data.color}</strong>
      </div>
      <input className="nodrag" type="color" onChange={data.onChange} defaultValue={data.color} />
      <Handle type="source" position={Position.Right} id="a" style={sourceHandleStyleA} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Right} id="b" style={sourceHandleStyleB} isConnectable={isConnectable} />
    </>
  );
};

export default memo(ColorSelectorNode);
