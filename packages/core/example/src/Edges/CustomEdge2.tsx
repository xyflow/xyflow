import { FC } from 'react';
import { EdgeProps, getBezierPath, EdgeText, getBezierEdgeCenter } from 'react-flow-renderer';

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
  const [centerX, centerY] = getBezierEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <path id={id} className="react-flow__edge-path" d={edgePath} />
      <EdgeText
        x={centerX}
        y={centerY}
        label={data.text}
        labelStyle={{ fill: 'white' }}
        labelShowBg
        labelBgStyle={{ fill: 'red' }}
        labelBgPadding={[2, 4]}
        labelBgBorderRadius={2}
        onClick={() => console.log(data)}
      />
      ;
    </>
  );
};

export default CustomEdge;
