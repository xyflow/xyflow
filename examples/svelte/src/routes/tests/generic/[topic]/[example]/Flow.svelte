<script lang="ts">
	import { writable } from 'svelte/store';
	import { SvelteFlow } from '@xyflow/svelte';

	import '@xyflow/svelte/dist/style.css';

	export let flowConfig: FlowConfig;

	// Create writables here so it is easier to create test cases
	const nodes = writable(flowConfig.flowProps.nodes);
	const edges = writable(flowConfig.flowProps.edges);

	const props = { ...flowConfig.flowProps, nodes, edges };
</script>

<SvelteFlow {...props} />
