<script lang="ts">
	import { writable } from 'svelte/store';
	import {
		SvelteFlow,
		Controls,
		Background,
		BackgroundVariant,
		Position,
		MiniMap,
		Panel,
		type ColorMode
	} from '@xyflow/svelte';

	import '@xyflow/svelte/dist/style.css';

	const nodeDefaults = {
		sourcePosition: Position.Right,
		targetPosition: Position.Left
	};

	const nodes = writable([
		{
			id: 'A',
			position: { x: 0, y: 150 },
			data: { label: 'A' },
			...nodeDefaults
		},
		{ id: 'B', position: { x: 250, y: 0 }, data: { label: 'B' }, ...nodeDefaults },
		{ id: 'C', position: { x: 250, y: 150 }, data: { label: 'C' }, ...nodeDefaults },
		{ id: 'D', position: { x: 250, y: 300 }, data: { label: 'D' }, ...nodeDefaults }
	]);

	const edges = writable([
		{ id: 'A-B', source: 'A', target: 'B' },
		{ id: 'A-C', source: 'A', target: 'C' },
		{ id: 'A-D', source: 'A', target: 'D' }
	]);

	let colorMode: ColorMode = 'light';
</script>

<SvelteFlow {nodes} {edges} {colorMode} fitView>
	<Controls />
	<Background variant={BackgroundVariant.Dots} />
	<MiniMap />

	<Panel>
		<select bind:value={colorMode} data-testid="colormode-select">
			<option value="light">light</option>
			<option value="dark">dark</option>
			<option value="system">system</option>
		</select>
	</Panel>
</SvelteFlow>
