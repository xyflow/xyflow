import { Handle, NodeProps, Position, ReactFlowState, useStore } from '@xyflow/react';

const connectionNodeIdSelector = (state: ReactFlowState) => state.connectionStartHandle?.nodeId;

export default function CustomNode({ id }: NodeProps) {
  const connectionNodeId = useStore(connectionNodeIdSelector);
  const isConnecting = !!connectionNodeId;
  const isTarget = connectionNodeId && connectionNodeId !== id;

  const targetHandleStyle = { zIndex: isTarget ? 3 : 1 };
  const label = isTarget ? 'Drop here' : 'Drag to connect';

  return (
    <div className="customNode">
      <div
        className="customNodeBody"
        style={{
          borderStyle: isTarget ? 'dashed' : 'solid',
          backgroundColor: isTarget ? '#ffcce3' : '#ccd9f6',
        }}
      >
        {!isConnecting && (
          <Handle className="customHandle" style={{ zIndex: 2 }} position={Position.Right} type="source" />
        )}

        <Handle
          className="customHandle"
          style={targetHandleStyle}
          position={Position.Left}
          type="target"
          isConnectableStart={false}
        />
        {label}
      </div>
    </div>
  );
}
