<script lang="ts">
	import { SvelteFlowProvider } from '@xyflow/svelte';

	import Flow from './Flow.svelte';

	interface Props {
		data: { flowConfig: FlowConfig };
	}

	let { data }: Props = $props();
</script>

<SvelteFlowProvider>
	<Flow flowConfig={data.flowConfig} />
</SvelteFlowProvider>
