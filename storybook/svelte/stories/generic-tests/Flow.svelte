<script lang="ts">
  import { SvelteFlow } from '@xyflow/svelte';
  import type { FlowConfig } from './types';

  let { flowConfig }: { flowConfig: FlowConfig } = $props();
  let nodes = $state.raw(flowConfig.flowProps.nodes);
  let edges = $state.raw(flowConfig.flowProps.edges);
</script>

<SvelteFlow {...flowConfig.flowProps} bind:nodes bind:edges />
