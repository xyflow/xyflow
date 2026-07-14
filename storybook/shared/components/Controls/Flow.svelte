<script lang="ts">
  import { Background, BackgroundVariant, Controls, SvelteFlow } from '@xyflow/svelte';

  import { basicAddonsConfig } from 'storybook-shared/flow-configs/basic-addons';

  import { type ControlsStoryArgs } from './config';

  let {
    class: className,
    showInteractive,
    style,
    ...controlsProps
  }: ControlsStoryArgs & { class?: string } = $props();

  const initialNodes = basicAddonsConfig.flowProps?.nodes ?? [];
  const initialEdges = basicAddonsConfig.flowProps?.edges ?? [];

  let nodes = $state.raw([...initialNodes]);
  let edges = $state.raw([...initialEdges]);
</script>

<div class="flow-story">
  <SvelteFlow {...basicAddonsConfig.flowProps} bind:nodes bind:edges>
    <Background variant={BackgroundVariant.Dots} />
    <Controls
      {...controlsProps}
      class={className}
      showLock={showInteractive}
      style={typeof style === 'object' ? JSON.stringify(style) : style}
    />
  </SvelteFlow>
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
