<script lang="ts">
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

	let nodes = $state([
		{
			id: 'A',
			position: { x: 0, y: 0 },
			data: { label: 'A' }
		},
		{ id: 'B', position: { x: 0, y: 100 }, data: { label: 'B' } }
	]);
	let edges = $state([{ id: 'ab', source: 'A', target: 'B' }]);
	let viewport = $state<Viewport>({ x: 0, y: 10, zoom: 1.25 });
	let facade = {
		get viewport() {
			return viewport;
		},
		set viewport(val) {
			viewport = val;
		}
	};

	const { fitView } = useSvelteFlow();

	const updateViewport = () => {
		viewport.x += 10;
	};

	$effect.pre(() => {
		console.log(viewport.x, viewport.y, viewport.zoom);
	});
</script>

<SvelteFlow bind:nodes bind:edges fitView bind:viewport={facade.viewport}>
	<Controls />
	<Background variant={BackgroundVariant.Dots} />

	<Panel>
		<button onclick={updateViewport}>update viewport</button>
		<button onclick={() => fitView()}>fitView</button>
	</Panel>
</SvelteFlow>
