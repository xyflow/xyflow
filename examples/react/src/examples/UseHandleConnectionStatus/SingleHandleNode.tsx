import { memo, FC, useEffect, useCallback } from 'react';
import { Handle, Position, NodeProps, useHandleConnectionStatus, Connection } from '@xyflow/react';
import { HandleComponentProps } from '@xyflow/react/dist/esm/components/Handle';

function CustomHandle({ nodeId, ...handleProps }: HandleComponentProps & { nodeId: string }) {
  const onConnect = useCallback(
    (connections: Connection[]) => {
      console.log('onConnect handler, node id:', nodeId, connections);
    },
    [nodeId]
  );
  const onDisconnect = useCallback(
    (connections: Connection[]) => {
      console.log('onDisconnect handler, node id:', nodeId, connections);
    },
    [nodeId]
  );
  const status = useHandleConnectionStatus({
    handleType: handleProps.type,
    handleId: handleProps.id,
    onConnect,
    onDisconnect,
  });

  useEffect(() => {
    console.log('useEffect, node id:', nodeId, handleProps.type, status);
  }, [status]);

  return <Handle {...handleProps} />;
}

const CustomNode: FC<NodeProps> = ({ id }) => {
  return (
    <div style={{ background: '#333', color: '#fff', padding: 10, fontSize: 12, borderRadius: 10 }}>
      <CustomHandle nodeId={id} type="target" position={Position.Left} />
      <div>node {id}</div>
      <CustomHandle nodeId={id} type="source" position={Position.Right} />
    </div>
  );
};

export default memo(CustomNode);
