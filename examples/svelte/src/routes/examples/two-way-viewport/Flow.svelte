<script lang="ts">
	import { writable } from 'svelte/store';
	import {
		SvelteFlow,
		Controls,
		Background,
		BackgroundVariant,
		Panel,
		useSvelteFlow,
		type Viewport
	} from '@xyflow/svelte';

	import '@xyflow/svelte/dist/style.css';

	const nodes = writable([
		{
			id: 'A',
			position: { x: 0, y: 0 },
			data: { label: 'A' }
		},
		{ id: 'B', position: { x: 0, y: 100 }, data: { label: 'B' } }
	]);
	const edges = writable([{ id: 'ab', source: 'A', target: 'B' }]);
	const viewport = writable<Viewport>({ x: 100, y: 100, zoom: 1.25 });

	const { fitView } = useSvelteFlow();

	const updateViewport = () => {
		$viewport.x += 10;
		$viewport = $viewport;
	};

	viewport.subscribe((vp) => {
		console.log('viewport update', vp);
	});
</script>

<SvelteFlow {nodes} {edges} {viewport}>
	<Controls />
	<Background variant={BackgroundVariant.Dots} />

	<Panel>
		<button onclick={updateViewport}>update viewport</button>
		<button onclick={() => fitView()}>fitView</button>
	</Panel>
</SvelteFlow>
