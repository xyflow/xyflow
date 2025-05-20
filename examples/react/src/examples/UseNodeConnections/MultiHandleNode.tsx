import { memo, FC, useEffect, useCallback } from 'react';
import { Handle, Position, NodeProps, useNodeConnections, Connection, HandleProps } from '@xyflow/react';

function CustomHandle({ nodeId, ...handleProps }: HandleProps & { nodeId: string }) {
  const onConnect = useCallback(
    (connections: Connection[]) => console.log('onConnect handler, node id:', nodeId, connections),
    [nodeId]
  );

  const onDisconnect = useCallback(
    (connections: Connection[]) => console.log('onDisconnect handler, node id:', nodeId, connections),
    [nodeId]
  );
  const connections = useNodeConnections({
    handleType: handleProps.type,
    handleId: handleProps.id,
    onConnect,
    onDisconnect,
  });

  useEffect(() => {
    console.log('useEffect, node id:', nodeId, handleProps.type, connections);
  }, [connections]);

  return <Handle {...handleProps} />;
}

const CustomNode: FC<NodeProps> = ({ id }) => {
  return (
    <div style={{ background: '#333', color: '#fff', padding: 10, fontSize: 12, borderRadius: 10 }}>
      <CustomHandle nodeId={id} type="target" position={Position.Left} id="t1" style={{ top: 10 }} />
      <CustomHandle nodeId={id} type="target" position={Position.Left} id="t2" style={{ top: 20 }} />
      <div>node {id}</div>
      <CustomHandle nodeId={id} type="source" position={Position.Right} id="s1" style={{ top: 10 }} />
      <CustomHandle nodeId={id} type="source" position={Position.Right} id="s2" style={{ top: 20 }} />
    </div>
  );
};

export default memo(CustomNode);
