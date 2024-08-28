import type { Node, Edge } from '@xyflow/svelte';

export const initialNodes: Node[] = [
	{
		id: '1',
		data: { label: 'Node 1' },
		position: { x: 0, y: 0 },
		style: 'width: 200px; height: 100px;'
	},
	{
		id: '2',
		data: { label: 'Node 2' },
		position: { x: 0, y: 150 },
		parentId: '1'
	},
	{
		id: '3',
		data: { label: 'Node 3' },
		position: { x: 250, y: 0 }
	},
	{
		id: '4',
		data: { label: 'Node' },
		position: { x: 350, y: 150 },
		style: 'width: 50px; height: 50px;'
	}
];

export const initialEdges: Edge[] = [];
