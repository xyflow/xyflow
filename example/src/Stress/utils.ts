import { Node, Edge } from 'react-flow-renderer';

type ElementsCollection = {
  nodes: Node[];
  edges: Edge[];
};

export function getNodesAndEdges(xElements: number = 10, yElements: number = 10): ElementsCollection {
  const initialNodes = [];
  const initialEdges: Edge[] = [];
  let nodeId = 1;
  let recentNodeId = null;

  for (let y = 0; y < yElements; y++) {
    for (let x = 0; x < xElements; x++) {
      const position = { x: x * 100, y: y * 50 };
      const data = { label: `Node ${nodeId}` };
      const node = {
        id: nodeId.toString(),
        style: { width: 50, fontSize: 11 },
        data,
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
