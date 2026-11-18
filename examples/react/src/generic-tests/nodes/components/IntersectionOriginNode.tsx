import { useState } from 'react';
import { useReactFlow } from '@xyflow/react';

export default function IntersectionOriginNode() {
  const { getNode, getIntersectingNodes, isNodeIntersecting } = useReactFlow();
  const [result, setResult] = useState('');

  const checkIntersections = () => {
    const root = getNode('root')!;
    const area = { x: 55, y: 55, width: 5, height: 5 };

    setResult(
      JSON.stringify({
        rootObject: isNodeIntersecting(root, area),
        rootId: isNodeIntersecting({ id: root.id }, area),
        explicitTargets: getIntersectingNodes(area, true, [root]).map((node) => node.id),
        implicitTargets: getIntersectingNodes(area).map((node) => node.id),
        ownOrigin: isNodeIntersecting(getNode('own-origin')!, { x: 295, y: 295, width: 2, height: 2 }),
        child: isNodeIntersecting(getNode('child')!, { x: 426, y: 426, width: 5, height: 5 }),
      })
    );
  };

  return (
    <div>
      <button className="nodrag" data-testid="check-intersections" onClick={checkIntersections}>
        Check intersections
      </button>
      <output data-testid="intersection-result">{result}</output>
    </div>
  );
}
