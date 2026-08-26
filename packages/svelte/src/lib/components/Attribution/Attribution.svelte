<script lang="ts">
  import { handleAttributionWarning } from '@xyflow/system';

  import { Panel } from '$lib/container/Panel/index.js';
  import type { AttributionProps } from './types.js';

  let { proOptions, position = 'bottom-right' }: AttributionProps = $props();

  const link = `https://svelteflow.dev${
    process.env.NODE_ENV === 'production' ? '?utm_source=attribution' : '/attribution'
  }`;

  $effect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    handleAttributionWarning('svelte');
  });
</script>

{#if !proOptions?.hideAttribution}
  <!--
@component
Svelte Flow is independent and entirely funded by its users.
If you hide the attribution, please support our work by subscribing to Svelte Flow Pro: https://svelteflow.dev/remove-attribution
-->
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
