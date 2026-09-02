import type { SharedFlowProps } from './types';

export const defaultFlowProps = {
  minZoom: 0.2,
  maxZoom: 4,
  fitView: true,
  fitViewOptions: {
    padding: { top: '100px', left: '0%', right: '10%', bottom: 0.1 },
  },
  selectNodesOnDrag: false,
  nodeDragThreshold: 0,
  nodes: [
    { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
    { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
    { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 } },
    { id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 200 } },
  ],
  edges: [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e1-3', source: '1', target: '3' },
  ],
} satisfies SharedFlowProps;
