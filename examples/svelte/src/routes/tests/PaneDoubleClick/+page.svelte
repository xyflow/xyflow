<script lang="ts">
	import { SvelteFlow, Background, Panel, type Node, type Edge } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';

	let nodes = $state.raw<Node[]>([
		{ id: '1', position: { x: 100, y: 100 }, data: { label: 'First node' } },
		{ id: '2', position: { x: 300, y: 300 }, data: { label: 'Second node' } }
	]);
	let edges = $state.raw<Edge[]>([{ id: 'edge', source: '1', target: '2' }]);
	let count = $state(0);
	let zoomOnDoubleClick = $state(false);
	let selectionOnDrag = $state(false);
	let lastEvent = $state('');
</script>

<SvelteFlow
	bind:nodes
	bind:edges
	{zoomOnDoubleClick}
	{selectionOnDrag}
	panOnDrag={selectionOnDrag ? [1, 2] : true}
	onpanedoubleclick={({ event }) => {
		count++;
		lastEvent = `${event.type}:${event.detail}`;
	}}
>
	<Background />
	<Panel position="top-right">
		<label><input type="checkbox" bind:checked={zoomOnDoubleClick} />Double-click zoom</label>
		<label><input type="checkbox" bind:checked={selectionOnDrag} />Drag selection</label>
		<output data-testid="pane-double-clicks">{count}</output>
		<output data-testid="pane-last-event">{lastEvent}</output>
	</Panel>
</SvelteFlow>
