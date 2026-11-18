import { useState } from 'react';
import { useReactFlow } from '@xyflow/react';

export default function IntersectionsProbeNode() {
  const { getIntersectingNodes, isNodeIntersecting, getInternalNode } = useReactFlow();
  const [intersecting, setIntersecting] = useState('');
  const [hiddenIntersects, setHiddenIntersects] = useState('');

  const check = () => {
    setIntersecting(
      getIntersectingNodes({ id: 'target' })
        .map((node) => node.id)
        .join(',')
    );

    const target = getInternalNode('target')!;
    const targetRect = {
      ...target.internals.positionAbsolute,
      width: target.measured.width ?? 0,
      height: target.measured.height ?? 0,
    };
    setHiddenIntersects(String(isNodeIntersecting({ id: 'hidden' }, targetRect)));
  };

  return (
    <div className="nodrag nopan" style={{ padding: 8, background: 'white' }}>
      <button onClick={check}>Check intersections</button>
      <output data-testid="intersecting-nodes">{intersecting}</output>
      <output data-testid="hidden-intersects">{hiddenIntersects}</output>
    </div>
  );
}
