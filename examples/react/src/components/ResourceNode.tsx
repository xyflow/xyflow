import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { ResourceData } from '../data/mockGraphData';

const statusColors = {
  Healthy: '#52c41a',
  Failed: '#ff4d4f',
  Pending: '#faad14',
  Unknown: '#d9d9d9',
};

const statusBgColors = {
  Healthy: '#f6ffed',
  Failed: '#fff1f0',
  Pending: '#fffbe6',
  Unknown: '#f5f5f5',
};

const statusBorderColors = {
  Healthy: '#b7eb8f',
  Failed: '#ffa39e',
  Pending: '#ffe58f',
  Unknown: '#d9d9d9',
};

const ResourceNode = ({ data, selected }: NodeProps<Node<ResourceData>>) => {
  const status = data.status || 'Unknown';
  const color = statusColors[status];
  const bgColor = statusBgColors[status];
  const borderColor = statusBorderColors[status];

  return (
    <div
      style={{
        padding: '12px 16px',
        borderRadius: '8px',
        background: '#ffffff',
        border: `1px solid ${selected ? '#1890ff' : '#e0e0e0'}`,
        boxShadow: selected ? '0 0 0 2px rgba(24, 144, 255, 0.2)' : '0 2px 8px rgba(0,0,0,0.08)',
        minWidth: '180px',
        textAlign: 'left',
        fontFamily: 'Inter, system-ui, sans-serif',
        transition: 'all 0.2s ease',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#b0b0b0' }} />
      
      <div style={{ 
        fontSize: '10px', 
        textTransform: 'uppercase', 
        color: '#888', 
        marginBottom: '4px',
        fontWeight: 600,
        letterSpacing: '0.5px'
      }}>
        {data.type}
      </div>
      
      <div style={{ 
        fontSize: '14px', 
        fontWeight: 600, 
        color: '#1f1f1f',
        marginBottom: '8px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>
        {data.name}
      </div>

      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: '12px',
        background: bgColor,
        border: `1px solid ${borderColor}`,
        fontSize: '11px',
        color: color,
        fontWeight: 500,
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: color,
          marginRight: '6px',
        }} />
        {status}
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#b0b0b0' }} />
    </div>
  );
};

export default memo(ResourceNode);
