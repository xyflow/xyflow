import dagre from '@dagrejs/dagre';
import type { SharedNode, SharedEdge } from '../../../types';

export function layoutNodes(nodes: SharedNode[], edges: SharedEdge[], direction: 'TB' | 'LR') {
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ rankdir: direction });
  const width = 172;
  const height = 50;
  nodes.forEach((node) => graph.setNode(node.id, { width, height }));
  edges.forEach((edge) => {
    if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) graph.setEdge(edge.source, edge.target);
  });
  dagre.layout(graph);
  return nodes.map((node) => {
    const position = graph.node(node.id);
    return {
      ...node,
      sourcePosition: direction === 'LR' ? 'right' : 'bottom',
      targetPosition: direction === 'LR' ? 'left' : 'top',
      position: { x: position.x - width / 2, y: position.y - height / 2 },
    };
  });
}
