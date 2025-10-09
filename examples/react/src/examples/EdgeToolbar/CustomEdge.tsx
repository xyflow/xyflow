import { EdgeLabelRenderer, getBezierPath, BaseEdge, EdgeProps } from '@xyflow/react';

import { EdgeToolbar } from '@xyflow/react';

export function CustomEdge({ id, data, ...props }: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath(props);

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeToolbar edgeId={id} labelX={labelX} labelY={labelY}>
        <button>delete</button>
        <button>edit</button>
      </EdgeToolbar>
    </>
  );
}
