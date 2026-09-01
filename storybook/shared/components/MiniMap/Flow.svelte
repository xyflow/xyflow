<script lang="ts">
  import { onMount } from 'svelte';
  import { Background, BackgroundVariant, MiniMap, SvelteFlow } from '@xyflow/svelte';

  import { defaultFlowProps } from '../defaultFlow';
  import { FLOW_STORY_RESET_EVENT } from 'storybook-shared/tests/suite';

  import { type MiniMapStoryArgs } from './config';

  let {
    class: className,
    nodeClassName,
    nodeClass,
    style,
    ...miniMapProps
  }: MiniMapStoryArgs & { class?: string; nodeClass?: string } = $props();

  const initialNodes = defaultFlowProps.nodes ?? [];
  const initialEdges = defaultFlowProps.edges ?? [];

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
    <SvelteFlow {...defaultFlowProps} bind:nodes bind:edges>
      <Background variant={BackgroundVariant.Dots} />
      <MiniMap
        {...miniMapProps}
        class={className}
        nodeClass={nodeClass ?? nodeClassName}
        style={typeof style === 'object' ? JSON.stringify(style) : style}
      />
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
