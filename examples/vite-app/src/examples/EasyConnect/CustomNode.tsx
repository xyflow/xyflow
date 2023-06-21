import { Handle, NodeProps, Position, ReactFlowState, useStore } from 'reactflow';

const connectionNodeIdSelector = (state: ReactFlowState) => state.connectionNodeId;

const sourceStyle = { zIndex: 2 };

export default function CustomNode({ id }: NodeProps) {
  const connectionNodeId = useStore(connectionNodeIdSelector);
  const isConnecting = !!connectionNodeId;
  const isTarget = connectionNodeId && connectionNodeId !== id;
  const label = isTarget ? 'Drop here' : 'Drag to connect';
  const targetStyle = { zIndex: isConnecting ? 3 : 1 };

  return (
    <div className="node">
      <div
        className="node-body"
        style={{
          borderStyle: isTarget ? 'dashed' : 'solid',
          backgroundColor: isTarget ? '#ffcce3' : '#ccd9f6',
        }}
      >
        {!isConnecting && <Handle className="handle" position={Position.Right} type="source" style={sourceStyle} />}

        <Handle className="handle" position={Position.Left} type="target" style={targetStyle} />
        {label}
      </div>
    </div>
  );
}
