<script lang="ts">
	import { writable } from 'svelte/store';
	import {
		SvelteFlow,
		Controls,
		Background,
		BackgroundVariant,
		MiniMap,
		Position,
		type Node,
		type NodeTypes,
		type Edge,
		type Connection
	} from '@xyflow/svelte';
	import CustomNode from './CustomNode.svelte';

	import '@xyflow/svelte/dist/style.css';

	const nodeTypes: NodeTypes = {
		colorNode: CustomNode
	};

	const bgColor = writable('#1A192B');

	const nodes = writable<Node[]>([
		{
			id: '1',
			type: 'input',
			data: { label: 'An input node' },
			position: { x: 0, y: 50 },
			sourcePosition: Position.Right
		},
		{
			id: '2',
			type: 'colorNode',
			data: { colorStore: bgColor },
			position: { x: 250, y: 50 }
		},
		{
			id: '3',
			type: 'output',
			data: { label: 'Output A' },
			position: { x: 650, y: 25 },
			targetPosition: Position.Left
		},
		{
			id: '4',
			type: 'output',
			data: { label: 'Output B' },
			position: { x: 650, y: 120 },
			targetPosition: Position.Left
		}
	]);

	const edges = writable<Edge[]>([
		{
			id: 'e1-2',
			source: '1',
			target: '2',
			animated: true
		},
		{
			id: 'e2a-3',
			source: '2',
			sourceHandle: 'a',
			target: '3',
			animated: true
		},
		{
			id: 'e2b-4',
			source: '2',
			sourceHandle: 'b',
			target: '4',
			animated: true
		}
	]);

	const onConnect = (connection: Connection) => {
		console.log('on connect', connection);
	};
</script>

<SvelteFlow
	{nodes}
	{edges}
	{nodeTypes}
	style="--xy-background-color: {$bgColor}"
	fitView
	onconnect={onConnect}
>
	<Controls />
	<Background variant={BackgroundVariant.Dots} />
	<MiniMap />
</SvelteFlow>
