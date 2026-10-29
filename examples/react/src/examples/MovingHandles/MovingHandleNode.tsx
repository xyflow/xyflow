import React, { memo, CSSProperties } from 'react';
import { Handle, Position, NodeProps, useConnection } from '@xyflow/react';

import type { MovingHandleNode } from '.';

const sourceHandleStyle: CSSProperties = {
  position: 'relative',
  transform: 'translate(-50%, 0)',
  top: 0,
  transition: 'transform 0.5s',
};

function MovingHandleNode({}: NodeProps<MovingHandleNode>) {
  const connection = useConnection();

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
          left: 0,
          top: 0,
          justifyContent: 'space-around',
          height: '100%',
        }}
      >
        <Handle
          type="target"
          id="a"
          position={Position.Left}
          style={{
            ...sourceHandleStyle,
            transform: connection.inProgress ? 'translate(-20px, 0)' : 'translate(-50%, 0)',
          }}
        />
        <Handle
          type="target"
          id="b"
          position={Position.Left}
          style={{
            ...sourceHandleStyle,
            transform: connection.inProgress ? 'translate(-20px, 0)' : 'translate(-50%, 0)',
          }}
        />
      </div>
      <div style={{ background: '#f4f4f4', padding: 10 }}>
        <div>moving handles</div>
        <Handle type="source" position={Position.Right} />
        <Handle type="source" position={Position.Right} />
      </div>
    </>
  );
}

export default memo(MovingHandleNode);
