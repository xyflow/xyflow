<script lang="ts">
	import { writable } from 'svelte/store';
	import { SvelteFlow } from '@xyflow/svelte';

	import '@xyflow/svelte/dist/style.css';

	export let generic: GenericTestCase;

	// Create writables here so it is easier to create test cases
	const nodes = writable(generic.flowProps.nodes);
	const edges = writable(generic.flowProps.edges);

	const svelteFlowPropsWithWritables = { ...generic.flowProps, nodes, edges };
</script>

<SvelteFlow {...svelteFlowPropsWithWritables} />
