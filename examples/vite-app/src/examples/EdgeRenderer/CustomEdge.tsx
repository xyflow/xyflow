import { FC, MouseEvent } from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer, useStore } from '@xyflow/react';

const CustomEdge: FC<EdgeProps> = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) => {
  const isConnectedNodeDragging = useStore((s) =>
    s.nodes.find((n) => n.dragging && (target === n.id || source === n.id))
  );

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    console.log('click', data.text);
  };

  return (
    <>
      <path id={id} className="react-flow__edge-path" d={edgePath} />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: '#ffcc00',
            padding: 10,
            zIndex: isConnectedNodeDragging ? 10 : 0,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          {data.text}
          <input style={{ display: 'block' }} />
          <button onClick={onClick}>send</button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
