<script lang="ts">
  import { Background, SvelteFlow } from '@xyflow/svelte';

  import { initialNodes, type SharedBackgroundArgs } from './config';

  // Shared args use the React prop names, but the Svelte argTypes also expose the
  // native `class` / `patternClass` controls, so accept either spelling.
  type Props = SharedBackgroundArgs & { class?: string; patternClass?: string };

  let {
    id = 'background',
    color,
    className,
    patternClassName,
    class: containerClass,
    patternClass,
    ...rest
  }: Props = $props();

  let nodes = $state.raw([...initialNodes]);
  let edges = $state.raw([]);
</script>

<div class="flow">
  <SvelteFlow bind:nodes bind:edges>
    <Background
      {...rest}
      {id}
      patternColor={color}
      class={className ?? containerClass}
      patternClass={patternClassName ?? patternClass}
    />
  </SvelteFlow>
</div>

<style>
  .flow {
    width: 100%;
    height: 100%;
  }

  .flow :global(.svelte-flow) {
    width: 100%;
    height: 100%;
  }
</style>
