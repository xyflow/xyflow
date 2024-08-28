import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const styles = { padding: '10px', background: 'green' };

const CustomNode = ({ data }) => (
  <>
    <div style={styles}>{data.label}</div>
    <Handle type="source" position={Position.Top} id="a" />
    <Handle type="source" position={Position.Bottom} id="b" />
  </>
);

export default memo(CustomNode);
