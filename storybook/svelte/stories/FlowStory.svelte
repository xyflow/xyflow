<script lang="ts">
  import { SvelteFlow } from '@xyflow/svelte';
  import type { SharedFlowConfig } from 'storybook-shared/types';

  let { flowConfig }: { flowConfig: SharedFlowConfig } = $props();

  let nodes = $state.raw(flowConfig.flowProps?.nodes ?? []);
  let edges = $state.raw(flowConfig.flowProps?.edges ?? []);
</script>

<div class="flow-story">
  <SvelteFlow {...flowConfig.flowProps} bind:nodes bind:edges />
</div>

<style>
  .flow-story {
    width: 100%;
    height: 100%;
  }
</style>
