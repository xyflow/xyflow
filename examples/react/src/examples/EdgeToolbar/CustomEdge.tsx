import { getBezierPath, BaseEdge, EdgeProps, useReactFlow } from '@xyflow/react';
import { EdgeToolbar } from '@xyflow/react';

export function CustomEdge({ id, data, ...props }: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath(props);
  const { setEdges } = useReactFlow();

  const deleteEdge = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeToolbar edgeId={id} x={labelX} y={labelY} isVisible>
        <button onClick={deleteEdge}>Delete</button>
      </EdgeToolbar>
    </>
  );
}
