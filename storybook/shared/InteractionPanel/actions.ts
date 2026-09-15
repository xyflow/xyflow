import { defaultFlowProps } from '../defaultFlow';

export type InteractionNode = {
  id: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
  selected?: boolean;
  className?: string;
  class?: string;
};
export type InteractionEdge = { id: string; source: string; target: string; selected?: boolean; style?: unknown };
export type InteractionAPI = {
  getNodes: () => InteractionNode[];
  getEdges: () => InteractionEdge[];
  setNodes: (nodes: InteractionNode[]) => void;
  addNodes: (nodes: InteractionNode[]) => void;
  setEdges: (edges: InteractionEdge[]) => void;
  setViewport: (viewport: { x: number; y: number; zoom: number }) => unknown;
  deleteElements: (elements: { nodes?: { id: string }[]; edges?: { id: string }[] }) => unknown;
  updateNodeData: (id: string, data: Record<string, unknown>) => unknown;
  toObject: () => unknown;
};

// The second fixture exercises replacement through the public instance API.
export const replacementFlow = {
  nodes: [
    { id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node a' } },
    { id: 'b', position: { x: 0, y: 150 }, data: { label: 'Node b' } },
  ],
  edges: [{ id: 'a-b', source: 'a', target: 'b' }],
};

export function createInteractionPanel(
  api: InteractionAPI,
  framework: 'react' | 'svelte',
  report: (name: string, value: unknown) => void
) {
  return {
    'Reset Transform': () => api.setViewport({ x: 0, y: 0, zoom: 1 }),
    'Change Pos': () =>
      api.setNodes(
        api.getNodes().map((node) => ({ ...node, position: { x: node.position.x + 40, y: node.position.y + 20 } }))
      ),
    'Toggle Classnames': () => {
      const key = framework === 'react' ? 'className' : 'class';
      api.setNodes(
        api
          .getNodes()
          .map((node) => ({ ...node, [key]: node[key] === 'interaction-highlight' ? '' : 'interaction-highlight' }))
      );
    },
    'Red Edges': () =>
      api.setEdges(
        api.getEdges().map((edge) => ({
          ...edge,
          style:
            framework === 'react'
              ? { ...(typeof edge.style === 'object' ? edge.style : {}), stroke: '#ff5050' }
              : `${typeof edge.style === 'string' ? edge.style : ''}; stroke: #ff5050;`,
        }))
      ),
    toObject: () => report('toObject', api.toObject()),
    deleteSelectedElements: () =>
      api.deleteElements({
        nodes: api.getNodes().filter((node) => node.selected),
        edges: api.getEdges().filter((edge) => edge.selected),
      }),
    deleteSomeElements: () => api.deleteElements({ nodes: [{ id: '2' }], edges: [{ id: 'e1-3' }] }),
    setNodes: () => {
      api.setNodes(structuredClone(replacementFlow.nodes));
      api.setEdges(structuredClone(replacementFlow.edges));
    },
    updateNode: () => {
      for (const node of api.getNodes().slice(0, 2)) api.updateNodeData(node.id, { label: 'Updated node' });
    },
    addNode: () => {
      const nodes = api.getNodes();
      let id = nodes.length + 1;
      while (nodes.some((node) => node.id === String(id))) id++;
      api.addNodes([
        { id: String(id), data: { label: `Node ${id}` }, position: { x: 100 + nodes.length * 30, y: 300 } },
      ]);
    },
    'Reset Flow': () => {
      api.setNodes(structuredClone(defaultFlowProps.nodes));
      api.setEdges(structuredClone(defaultFlowProps.edges));
    },
    'Inspect Nodes': () => report('nodes', api.getNodes()),
    'Inspect Edges': () => report('edges', api.getEdges()),
  };
}

export type FlowActionId = keyof ReturnType<typeof createInteractionPanel>;
export const panelActions: { id: FlowActionId; label: string }[] = [
  { id: 'Reset Transform', label: 'Reset viewport' },
  { id: 'addNode', label: 'Add node' },
  { id: 'updateNode', label: 'Update labels' },
  { id: 'Change Pos', label: 'Move nodes' },
  { id: 'setNodes', label: 'Replace graph' },
  { id: 'Toggle Classnames', label: 'Toggle highlight' },
  { id: 'Red Edges', label: 'Red edges' },
  { id: 'Inspect Nodes', label: 'Nodes' },
  { id: 'Inspect Edges', label: 'Edges' },
  { id: 'toObject', label: 'Flow object' },
  { id: 'deleteSelectedElements', label: 'Delete selected' },
  { id: 'deleteSomeElements', label: 'Delete sample' },
  { id: 'Reset Flow', label: 'Reset graph' },
];
