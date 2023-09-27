<script lang="ts">
	import { writable } from 'svelte/store';
	import {
		SvelteFlow,
		Controls,
		Background,
		BackgroundVariant,
		type IsValidConnection,
		Position
	} from '@xyflow/svelte';

	import '@xyflow/svelte/dist/style.css';
	import './style.css';

	const nodeDefaults = {
		sourcePosition: Position.Right,
		targetPosition: Position.Left
	};

	const nodes = writable([
		{
			id: '0',
			position: { x: 0, y: 150 },
			data: { label: 'only connectable with B' },
			...nodeDefaults
		},
		{ id: 'A', position: { x: 250, y: 0 }, data: { label: 'A' }, ...nodeDefaults },
		{ id: 'B', position: { x: 250, y: 150 }, data: { label: 'B' }, ...nodeDefaults },
		{ id: 'C', position: { x: 250, y: 300 }, data: { label: 'C' }, ...nodeDefaults }
	]);

	const edges = writable([]);

	const isValidConnection: IsValidConnection = (connection) => connection.target === 'B';

	const defaultEdgeOptions = {
		animated: true
	};
</script>

<SvelteFlow
	{nodes}
	{edges}
	fitView
	minZoom={0.1}
	maxZoom={2.5}
	{isValidConnection}
	{defaultEdgeOptions}
>
	<Controls />
	<Background variant={BackgroundVariant.Dots} />
</SvelteFlow>
