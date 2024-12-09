import { FC } from 'react';
import { BaseEdge, EdgeProps, EdgeText, getSmoothStepPath } from '@xyflow/react';
import './CustomEdge3.css';

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
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} pathLength={100} />
      <EdgeText
        x={labelX}
        y={labelY - 5}
        label={data.text}
        labelBgStyle={{ fill: 'transparent' }}
        onClick={() => console.log(data)}
      />
    </>
  );
};

export default CustomEdge;
