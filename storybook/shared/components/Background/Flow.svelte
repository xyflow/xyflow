<script lang="ts">
  import { Background, BackgroundVariant, SvelteFlow } from '@xyflow/svelte';

  import { initialNodes, type BackgroundVariantName, type SharedBackgroundArgs } from './config';

  const variantMap: Record<BackgroundVariantName, BackgroundVariant> = {
    dots: BackgroundVariant.Dots,
    lines: BackgroundVariant.Lines,
    cross: BackgroundVariant.Cross,
  };

  function mapBackgroundArgs(args: SharedBackgroundArgs = {}) {
    const { variant, color, className, patternClassName, ...rest } = args;

    return {
      ...rest,
      ...(variant ? { variant: variantMap[variant] } : {}),
      ...(color ? { patternColor: color } : {}),
      ...(className ? { class: className } : {}),
      ...(patternClassName ? { patternClass: patternClassName } : {}),
    };
  }

  let backgroundArgs: SharedBackgroundArgs = $props();

  const backgroundProps = $derived(mapBackgroundArgs(backgroundArgs));

  let nodes = $state.raw([...initialNodes]);
  let edges = $state.raw([]);
</script>

<div class="flow">
  <SvelteFlow bind:nodes bind:edges>
    <Background {...backgroundProps} id={backgroundProps.id ?? 'background'} />
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
