import React, { memo } from 'react';

import Handle from '../../components/Handle';
import { NodeProps, Position } from '../../types';

const OutputNode = ({ data, isConnectable, targetPosition = Position.Top }: NodeProps) => (
  <>
      <Handle type="target" position={targetPosition} isConnectable={isConnectable} />
  <div style={{textAlign: 'center'}}>
    <input />
  </div>
  <table>
    <>
    <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
    <tr>
      <td contentEditable><input /></td>
      <td contentEditable><input /></td>
    </tr>

    <Handle type="target" position={Position.Right} isConnectable={isConnectable} />
    <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
    <tr>
      <td contentEditable><input /></td>
      <td contentEditable><input /></td>
    </tr>

    <Handle type="target" position={Position.Right} isConnectable={isConnectable} />
    </>
  </table>
  <Handle type="target" position={Position.Bottom} isConnectable={isConnectable} />
  </>
);

OutputNode.displayName = 'EntityNode';

export default memo(OutputNode);
