import type { Edge, Node } from '@xyflow/svelte';

export const initialNodes: Node[] = [
	{
		id: '1',
		data: { label: '1' },
		position: { x: 0, y: 0 },
		class: 'test-class',
		style: 'background-color: red;'
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
	},
	{
		id: '4',
		data: { label: '4' },
		position: { x: 0, y: 200 }
	},
	{
		id: 'notDraggable',
		data: { label: 'notDraggable' },
		position: { x: 0, y: 300 },
		draggable: false
	},
	{
		id: 'notSelectable',
		data: { label: 'notSelectable' },
		position: { x: 0, y: 400 },
		selectable: false
	},
	{
		id: 'notConnectable',
		data: { label: 'notConnectable' },
		position: { x: 0, y: 500 },
		connectable: false
	},
	{
		id: 'notDeletable',
		data: { label: 'notDeletable' },
		position: { x: 0, y: 600 },
		connectable: false
	},
	{
		id: 'hidden',
		data: { label: 'hidden' },
		position: { x: 0, y: 700 },
		hidden: true
	}
];

export const initialEdges: Edge[] = [
	{
		id: '1-2',
		type: 'default',
		source: '1',
		target: '2',
		label: 'edge'
	},
	{
		id: '1-3',
		type: 'default',
		source: '1',
		target: '3',
		label: 'edge'
	}
];
