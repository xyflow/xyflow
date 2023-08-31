import { FC } from 'react';
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

  return (
    <>
      <path id={id} className="react-flow__edge-path" d={edgePath} />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: 'white',
            border: '1px solid #555',
            padding: 5,
            zIndex: isConnectedNodeDragging ? 10 : 0,
          }}
        >
          {data.text}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
