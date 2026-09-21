import type { Edge, Node } from '@xyflow/vue';

export function getElements(xElements = 10, yElements = 10) {
  const initialNodes: Node[] = [];
  const initialEdges: Edge[] = [];
  let nodeId = 1;
  let recentNodeId = null;

  for (let y = 0; y < yElements; y++) {
    for (let x = 0; x < xElements; x++) {
      const position = { x: x * 100, y: y * 50 };
      const node = {
        id: nodeId.toString(),
        style: { width: '50px', fontSize: '11px' },
        class: 'light',
        data: { label: `Node ${nodeId}` },
        position,
      };
      initialNodes.push(node);

      if (recentNodeId && nodeId <= xElements * yElements) {
        initialEdges.push({ id: `${x}-${y}`, source: recentNodeId.toString(), target: nodeId.toString() });
      }

      recentNodeId = nodeId;
      nodeId++;
    }
  }

  return {
    nodes: initialNodes,
    edges: initialEdges,
  };
}
