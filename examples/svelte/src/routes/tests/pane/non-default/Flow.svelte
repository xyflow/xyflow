<script lang="ts">
	import { writable } from 'svelte/store';
	import { initialNodes, initialEdges } from './nodesAndEdges';
	import { SvelteFlow } from '@xyflow/svelte';

	import '@xyflow/svelte/dist/style.css';

	const nodes = writable(initialNodes);
	const edges = writable(initialEdges);
</script>

<SvelteFlow
	{nodes}
	{edges}
	panOnScroll={true}
	initialViewport={{ x: 1.23, y: 9.87, zoom: 1.234 }}
	autoPanOnConnect={false}
	autoPanOnNodeDrag={false}
/>
