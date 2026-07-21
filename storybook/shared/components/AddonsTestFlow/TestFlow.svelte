<script lang="ts">
  import { onMount } from 'svelte';
  import { Background, BackgroundVariant, Controls, MiniMap, SvelteFlow } from '@xyflow/svelte';

  import { basicAddonsConfig } from '../AddonsTestFlow/config';
  import { FLOW_STORY_RESET_EVENT } from 'storybook-shared/tests/suite';

  const initialNodes = basicAddonsConfig.flowProps?.nodes ?? [];
  const initialEdges = basicAddonsConfig.flowProps?.edges ?? [];

  let nodes = $state.raw([...initialNodes]);
  let edges = $state.raw([...initialEdges]);
  let resetKey = $state(0);

  onMount(() => {
    const reset = () => {
      nodes = [...initialNodes];
      edges = [...initialEdges];
      resetKey += 1;
    };

    window.addEventListener(FLOW_STORY_RESET_EVENT, reset);
    return () => window.removeEventListener(FLOW_STORY_RESET_EVENT, reset);
  });
</script>

<div class="flow-story">
  {#key resetKey}
    <SvelteFlow {...basicAddonsConfig.flowProps} bind:nodes bind:edges>
      <Background variant={BackgroundVariant.Dots} />
      <MiniMap />
      <Controls />
    </SvelteFlow>
  {/key}
</div>

<style>
  .flow-story {
    width: 100%;
    height: 100%;
  }

  .flow-story :global(.svelte-flow) {
    width: 100%;
    height: 100%;
  }
</style>
