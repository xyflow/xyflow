<script lang="ts">
	import { SvelteFlow, Controls, Background, MiniMap } from '@xyflow/svelte';

	import '@xyflow/svelte/dist/style.css';

	let nodes = $state.raw([
		{
			id: 'A',
			position: { x: 0, y: 0 },
			data: { label: 'A' }
		},
		{ id: 'B', position: { x: -100, y: 150 }, data: { label: 'B' } },
		{ id: 'C', position: { x: 100, y: 150 }, data: { label: 'C' } },
		{ id: 'D', position: { x: 0, y: 260 }, data: { label: 'D' } }
	]);

	let edges = $state.raw([
		{ id: 'A-B', source: 'A', target: 'B' },
		{ id: 'A-C', source: 'A', target: 'C' },
		{ id: 'A-D', source: 'A', target: 'D' }
	]);
</script>

<SvelteFlow
	bind:nodes
	bind:edges
	fitView
	ariaLabelConfig={{
		'node.a11yDescription.default': 'Svelte Custom Node Desc.',
		'node.a11yDescription.keyboardDisabled': 'Svelte Custom Keyboard Desc.',
		'edge.a11yDescription.default': 'Svelte Custom Edge Desc.',
		'a11yDescription.ariaLiveMessage': ({ direction, x, y }) =>
			`Custom Moved selected node ${direction}. New position, x: ${x}, y: ${y}`,
		'controls.ariaLabel': 'Svelte Custom Control Aria Label',
		'controls.zoomin.ariaLabel': 'Svelte Custom Zoom in',
		'controls.zoomout.ariaLabel': 'Svelte Custom Zoom Out',
		// 'controls.fitview.ariaLabel': 'Svelte Custom Fit View',
		'controls.interactive.ariaLabel': 'Svelte Custom Toggle Interactivity',
		'minimap.ariaLabel': 'Svelte Custom Minimap'
	}}
>
	<Controls />
	<Background />
	<MiniMap />
</SvelteFlow>
