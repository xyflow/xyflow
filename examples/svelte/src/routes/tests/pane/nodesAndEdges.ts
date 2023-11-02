import type { Edge, Node } from '@xyflow/svelte';

export const initialNodes: Node[] = [
	{
		id: '1',
		data: { label: '1' },
		position: { x: 0, y: 0 },
		type: 'input'
	},
	{
		id: '2',
		data: { label: '2' },
		position: { x: -100, y: 100 }
	},
	{
		id: '3',
		data: { label: '3' },
		position: { x: 100, y: 100 }
	}
];

export const initialEdges: Edge[] = [
	{
		id: 'edge-with-class',
		source: '1',
		target: '2',
		class: 'edge-class-test'
	},
	{
		id: 'edge-with-style',
		source: '1',
		target: '3',
		style: 'stroke: red;'
	}
];
