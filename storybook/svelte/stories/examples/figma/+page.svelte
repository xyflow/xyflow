<script lang="ts">
	import {
		SvelteFlow,
		Controls,
		Background,
		BackgroundVariant,
		SelectionMode
	} from '@xyflow/svelte';

	import '@xyflow/svelte/dist/style.css';

	const panOnDrag = [1, 2];

	const onmovestart = (e: any) => console.log('move start', e);
	const onmove = (e: any) => console.log('move', e);
	const onmoveend = (e: any) => console.log('move end', e);

	let nodes = $state.raw([
		{
			id: '1',
			type: 'input',
			data: { label: 'Node 1' },
			position: { x: 250, y: 5 },
			className: 'light'
		},
		{ id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 }, className: 'light' },
		{ id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 }, className: 'light' },
		{ id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 200 }, className: 'light' }
	]);

	let edges = $state.raw([
		{ id: 'e1-2', source: '1', target: '2', animated: true },
		{ id: 'e1-3', source: '1', target: '3' }
	]);
</script>

<SvelteFlow
	bind:nodes
	bind:edges
	fitView
	selectionMode={SelectionMode.Partial}
	multiSelectionKey={['Meta', 'Shift']}
	selectionOnDrag
	panOnScroll
	paneClickDistance={100}
	{panOnDrag}
	{onmovestart}
	{onmove}
	{onmoveend}
	onpaneclick={(e) => console.log('on pane click', e)}
	onselectionend={(e) => console.log('on selection end', e)}
	onselectionstart={(e) => console.log('on selection start', e)}
>
	<Controls />
	<Background variant={BackgroundVariant.Dots} />
</SvelteFlow>
