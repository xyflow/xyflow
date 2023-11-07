<script lang="ts">
	import { SvelteFlowProvider } from '@xyflow/svelte';

	import Flow from './Flow.svelte';

	export let data;
</script>

<SvelteFlowProvider>
	<Flow generic={data.generic} />
</SvelteFlowProvider>
