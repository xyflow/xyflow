import { FC } from 'react';
import { EdgeProps, getBezierPath } from 'react-flow-renderer';

const CustomEdge: FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) => {
  const edgePath = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });

  return (
    <>
      <path id={id} className="react-flow__edge-path" d={edgePath} />
      <text>
        <textPath href={`#${id}`} style={{ fontSize: '12px' }} startOffset="50%" textAnchor="middle">
          {data.text}
        </textPath>
      </text>
    </>
  );
};

export default CustomEdge;
