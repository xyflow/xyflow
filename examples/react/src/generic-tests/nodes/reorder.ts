import { createElement } from 'react';
import { useReactFlow } from '@xyflow/react';

function ReorderButton() {
  const { setNodes, setEdges } = useReactFlow();
  return createElement(
    'button',
    {
      onClick: () => {
        setNodes((nodes) =>
          nodes[0].id === 'parent' ? [nodes[2], nodes[0], nodes[1]] : [nodes[1], nodes[2], nodes[0]]
        );
        setEdges((edges) => [...edges].reverse());
      },
    },
    'Reorder'
  );
}

export default {
  flowProps: {
    fitView: true,
    nodes: [
      {
        id: 'parent',
        position: { x: 0, y: 0 },
        data: { label: 'Parent' },
        style: { width: 250, height: 200 },
        selected: true,
      },
      { id: 'child', parentId: 'parent', position: { x: 30, y: 80 }, data: { label: 'Child' } },
      { id: 'other', position: { x: 400, y: 0 }, data: { label: 'Other' } },
    ],
    edges: [
      { id: 'first', source: 'parent', target: 'other' },
      { id: 'second', source: 'child', target: 'other' },
    ],
  },
  panelProps: { position: 'bottom-right', children: createElement(ReorderButton) },
} satisfies FlowConfig;
