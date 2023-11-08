<script lang="ts">
	import { SvelteFlowProvider } from '@xyflow/svelte';

	import Flow from './Flow.svelte';

	export let data: { flowConfig: FlowConfig };
</script>

<SvelteFlowProvider>
	<Flow flowConfig={data.flowConfig} />
</SvelteFlowProvider>
