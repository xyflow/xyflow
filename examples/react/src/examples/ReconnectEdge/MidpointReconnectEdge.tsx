import { BaseEdge, EdgeReconnectAnchor, getBezierPath, type EdgeProps } from '@xyflow/react';

export default function MidpointReconnectEdge(props: EdgeProps) {
  const [path, x, y] = getBezierPath(props);

  return (
    <>
      <BaseEdge id={props.id} path={path} style={props.style} />
      <EdgeReconnectAnchor
        type="target"
        position={{ x, y }}
        size={16}
        title="Drag to reconnect the target"
        style={{ background: 'white', border: '1px solid #888', borderRadius: '50%' }}
      />
    </>
  );
}
