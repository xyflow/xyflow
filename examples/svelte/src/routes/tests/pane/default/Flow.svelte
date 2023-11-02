<script lang="ts">
	import { writable } from 'svelte/store';
	import { initialNodes, initialEdges } from './nodesAndEdges';
	import { SvelteFlow } from '@xyflow/svelte';

	import '@xyflow/svelte/dist/style.css';

	const nodes = writable(initialNodes);
	const edges = writable(initialEdges);
</script>

<SvelteFlow {nodes} {edges} fitView minZoom={0.25} maxZoom={4} />
