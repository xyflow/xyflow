import React from 'react';
import { Node } from '@xyflow/react';
import { ResourceData } from '../data/mockGraphData';

interface DetailPanelProps {
  selectedNode: Node<ResourceData> | null;
}

const panelStyle: React.CSSProperties = {
  position: 'absolute',
  top: '24px',
  right: '24px',
  width: '360px',
  backgroundColor: 'white',
  boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
  borderRadius: '12px',
  padding: '0',
  zIndex: 10,
  fontFamily: 'Inter, system-ui, sans-serif',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid #f0f0f0',
};

const headerStyle: React.CSSProperties = {
  padding: '20px 24px',
  borderBottom: '1px solid #f0f0f0',
  backgroundColor: '#fafafa',
};

const contentStyle: React.CSSProperties = {
  padding: '24px',
  flex: 1,
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 600,
  textTransform: 'uppercase',
  color: '#8c8c8c',
  marginBottom: '6px',
  letterSpacing: '0.6px',
};

const valueStyle: React.CSSProperties = {
  fontSize: '15px',
  color: '#1f1f1f',
  fontWeight: 500,
  lineHeight: '1.5',
  marginBottom: '20px',
};

const statusBadgeStyle = (status: string): React.CSSProperties => {
  const colors: Record<string, { bg: string; color: string; border: string }> = {
    Healthy: { bg: '#f6ffed', color: '#52c41a', border: '#b7eb8f' },
    Failed: { bg: '#fff1f0', color: '#ff4d4f', border: '#ffa39e' },
    Pending: { bg: '#fffbe6', color: '#faad14', border: '#ffe58f' },
    Unknown: { bg: '#f5f5f5', color: '#d9d9d9', border: '#d9d9d9' },
  };
  const theme = colors[status] || colors.Unknown;
  
  return {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 10px',
    borderRadius: '20px',
    backgroundColor: theme.bg,
    color: theme.color,
    border: `1px solid ${theme.border}`,
    fontSize: '13px',
    fontWeight: 600,
  };
};

export const DetailPanel: React.FC<DetailPanelProps> = ({ selectedNode }) => {
  if (!selectedNode) {
    return null;
  }

  const { data } = selectedNode;

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#8c8c8c', marginBottom: '4px', textTransform: 'uppercase' }}>
          {data.type}
        </div>
        <div style={{ fontSize: '18px', fontWeight: 700, color: '#141414' }}>
          {data.name}
        </div>
      </div>
      
      <div style={contentStyle}>
        <div>
          <span style={labelStyle}>Status</span>
          <div style={{ marginBottom: '24px' }}>
            <span style={statusBadgeStyle(data.status)}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'currentColor',
                marginRight: '8px',
              }} />
              {data.status}
            </span>
          </div>
        </div>

        {data.message && (
          <div style={{
            marginTop: '8px',
            padding: '16px',
            backgroundColor: '#fff2f0',
            border: '1px solid #ffccc7',
            borderRadius: '8px',
          }}>
            <span style={{ ...labelStyle, color: '#ff4d4f', marginBottom: '8px' }}>Analysis</span>
            <div style={{ fontSize: '14px', color: '#cf1322', lineHeight: '1.5' }}>
              {data.message}
            </div>
          </div>
        )}

        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #f0f0f0' }}>
            <span style={labelStyle}>Details</span>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>API Version</div>
                    <div style={{ fontSize: '13px', color: '#262626' }}>v1alpha1</div>
                </div>
                <div>
                     <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Created</div>
                     <div style={{ fontSize: '13px', color: '#262626' }}>2h ago</div>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};
