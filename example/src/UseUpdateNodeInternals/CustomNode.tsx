import React, { memo, FC, useMemo, CSSProperties, useState } from 'react';
import { Handle, Position, NodeProps, useUpdateNodeInternals } from 'react-flow-renderer';

const nodeStyles: CSSProperties = { padding: 10, border: '1px solid #ddd' };

const CustomNode: FC<NodeProps> = ({ id }) => {
  const [handleCount, setHandleCount] = useState(1);
  const updateNodeInternals = useUpdateNodeInternals();

  const handles = useMemo(
    () =>
      Array.from({ length: handleCount }, (x, i) => {
        const handleId = `handle-${i}`;
        return <Handle key={handleId} type="source" position={Position.Right} id={handleId} style={{ top: 10 * i }} />;
      }),
    [handleCount]
  );

  return (
    <div style={nodeStyles}>
      <Handle type="target" position={Position.Left} />
      <div>output handle count: {handleCount}</div>
      <button
        onClick={() => {
          setHandleCount((c) => c + 1);
          updateNodeInternals(id);
        }}
      >
        add handle
      </button>
      {handles}
    </div>
  );
};

export default memo(CustomNode);
