<script lang="ts">
  import { onMount } from 'svelte';
  import { SvelteFlow, type NodeTypes } from '@xyflow/svelte';

  import { nodeToolbarSvelteConfig } from './testConfig';
  import { FLOW_STORY_RESET_EVENT } from 'storybook-shared/tests/suite';

  import ToolbarNode from 'storybook-component-toolbar-node';

  const initialNodes = nodeToolbarSvelteConfig.flowProps?.nodes ?? [];
  const initialEdges = nodeToolbarSvelteConfig.flowProps?.edges ?? [];
  const nodeTypes: NodeTypes = { ToolbarNode };

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
    <SvelteFlow {...nodeToolbarSvelteConfig.flowProps} {nodeTypes} bind:nodes bind:edges />
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
