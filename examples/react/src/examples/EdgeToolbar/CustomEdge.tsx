import { getBezierPath, BaseEdge, EdgeProps, useReactFlow, getStraightPath, getSmoothStepPath } from '@xyflow/react';
import { EdgeToolbar } from '@xyflow/react';

const getPath = (props: EdgeProps) => {
  switch (props.data!.type) {
    case 'smoothstep':
      return getSmoothStepPath(props);
    case 'straight':
      return getStraightPath(props);
    default:
      return getBezierPath(props);
  }
};

export function CustomEdge(props: EdgeProps) {
  const [edgePath, centerX, centerY] = getPath(props);
  const { setEdges } = useReactFlow();

  const deleteEdge = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== props.id));
  };

  return (
    <>
      <BaseEdge id={props.id} path={edgePath} />
      <EdgeToolbar
        edgeId={props.id}
        x={centerX + 0}
        y={centerY + 0}
        alignX={props.data?.align?.[0] ?? 'center'}
        alignY={props.data?.align?.[1] ?? 'center'}
        isVisible
      >
        <button style={{}} onClick={deleteEdge}>
          Delete
        </button>
      </EdgeToolbar>
    </>
  );
}
