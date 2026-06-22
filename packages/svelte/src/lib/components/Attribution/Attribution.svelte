<script lang="ts">
  import { Panel } from '$lib/container/Panel';
  import type { AttributionProps } from './types';

  let { proOptions, position = 'bottom-right' }: AttributionProps = $props();

  const link = `https://svelteflow.dev${
    process.env.NODE_ENV === 'production' ? '?utm_source=attribution' : '/attribution'
  }`;
</script>

{#if !proOptions?.hideAttribution}
  <Panel
    {position}
    class="svelte-flow__attribution"
    data-message={`Please only hide this attribution when you are subscribed to Svelte Flow Pro: ${link}`}
  >
    <a href={link} target="_blank" rel="noopener noreferrer" aria-label="Svelte Flow attribution">
      Svelte Flow
    </a>
  </Panel>
{/if}
