import React, { memo, FC, CSSProperties, useCallback } from 'react';
import { Handle, Position, NodeProps, Connection, Edge, useOnViewportChange, Viewport } from 'reactflow';

const targetHandleStyle: CSSProperties = { background: '#555' };
const sourceHandleStyleA: CSSProperties = { ...targetHandleStyle, top: 10 };
const sourceHandleStyleB: CSSProperties = {
  ...targetHandleStyle,
  bottom: 10,
  top: 'auto',
};

const onConnect = (params: Connection | Edge) => console.log('handle onConnect', params);

const ColorSelectorNode: FC<NodeProps> = ({ data, isConnectable }) => {
  const onStart = useCallback((viewport: Viewport) => console.log('onStart', viewport), []);
  const onChange = useCallback((viewport: Viewport) => console.log('onChange', viewport), []);
  const onEnd = useCallback((viewport: Viewport) => console.log('onEnd', viewport), []);

  useOnViewportChange({
    onStart,
    onChange,
    onEnd,
  });

  return (
    <>
      <Handle type="target" position={Position.Left} style={targetHandleStyle} onConnect={onConnect} />
      <div>
        Custom Color Picker Node: <strong>{data.color}</strong>
      </div>
      <input className="nodrag" type="color" onChange={data.onChange} defaultValue={data.color} />
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={sourceHandleStyleA}
        isConnectable={isConnectable}
        onMouseDown={(e) => {
          console.log('You trigger mousedown event', e);
        }}
      />
      <Handle type="source" position={Position.Right} id="b" style={sourceHandleStyleB} isConnectable={isConnectable} />
    </>
  );
};

export default memo(ColorSelectorNode);
