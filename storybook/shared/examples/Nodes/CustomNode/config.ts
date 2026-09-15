import { defaultFlowProps } from '../../../defaultFlow';
export const initialNodes = defaultFlowProps.nodes.map((node) =>
  node.id === '2' ? { ...node, type: 'color', data: { ...node.data, color: '#1a192b' } } : node
);
export const initialEdges = defaultFlowProps.edges;
