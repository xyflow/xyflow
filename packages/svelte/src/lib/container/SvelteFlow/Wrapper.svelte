<script lang="ts">
  import { hasContext } from 'svelte';
  import { key } from '$lib/store';

  import SvelteFlow from './SvelteFlow.svelte';
  import { SvelteFlowProvider } from '$lib/components/SvelteFlowProvider';
  import type { SvelteFlowProps } from './types';
  
  type $$Props = SvelteFlowProps;

  // @todo how to do this typing right?
  const props = $$props as SvelteFlowProps;
</script>

{#if hasContext(key)}
  <SvelteFlow {...props}>
    <slot />
  </SvelteFlow>
{:else}
  <SvelteFlowProvider>
    <SvelteFlow {...props}>
      <slot />
    </SvelteFlow>
  </SvelteFlowProvider>
{/if}