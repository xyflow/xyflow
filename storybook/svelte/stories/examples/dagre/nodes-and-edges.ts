import type { Node, Edge } from '@xyflow/svelte';

const position = { x: 0, y: 0 };
const edgeType = 'smoothstep';

export const initialNodes: Node[] = [
	{
		id: '1',
		type: 'input',
		data: { label: 'input' },
		position
	},
	{
		id: '2',
		data: { label: 'node 2' },
		position
	},
	{
		id: '2a',
		data: { label: 'node 2a' },
		position
	},
	{
		id: '2b',
		data: { label: 'node 2b' },
		position
	},
	{
		id: '2c',
		data: { label: 'node 2c' },
		position
	},
	{
		id: '2d',
		data: { label: 'node 2d' },
		position
	},
	{
		id: '3',
		data: { label: 'node 3' },
		position
	},
	{
		id: '4',
		data: { label: 'node 4' },
		position
	},
	{
		id: '5',
		data: { label: 'node 5' },
		position
	},
	{
		id: '6',
		type: 'output',
		data: { label: 'output' },
		position
	},
	{ id: '7', type: 'output', data: { label: 'output' }, position }
];

export const initialEdges: Edge[] = [
	{ id: 'e12', source: '1', target: '2', type: edgeType, animated: true },
	{ id: 'e13', source: '1', target: '3', type: edgeType, animated: true },
	{ id: 'e22a', source: '2', target: '2a', type: edgeType, animated: true },
	{ id: 'e22b', source: '2', target: '2b', type: edgeType, animated: true },
	{ id: 'e22c', source: '2', target: '2c', type: edgeType, animated: true },
	{ id: 'e2c2d', source: '2c', target: '2d', type: edgeType, animated: true },
	{ id: 'e45', source: '4', target: '5', type: edgeType, animated: true },
	{ id: 'e56', source: '5', target: '6', type: edgeType, animated: true },
	{ id: 'e57', source: '5', target: '7', type: edgeType, animated: true }
];
