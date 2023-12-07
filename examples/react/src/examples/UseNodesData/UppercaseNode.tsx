import { memo, useEffect } from 'react';
import { Position, NodeProps, useUpdateNodeData, Handle, useHandleConnections, useNodesData } from '@xyflow/react';

function UppercaseNode({ id }: NodeProps) {
  const connections = useHandleConnections({
    handleType: 'target',
  });
  const nodeData = useNodesData<{ text: string }>(connections[0]?.source);
  const updateNodeData = useUpdateNodeData();

  useEffect(() => {
    updateNodeData(id, { text: nodeData?.text.toUpperCase() });
  }, [nodeData]);

  return (
    <div style={{ background: '#eee', color: '#222', padding: 10, fontSize: 12, borderRadius: 10 }}>
      <Handle type="source" position={Position.Right} />
      <div>uppercase transform</div>
      <Handle type="target" position={Position.Left} isConnectable={connections.length === 0} />
    </div>
  );
}

export default memo(UppercaseNode);
