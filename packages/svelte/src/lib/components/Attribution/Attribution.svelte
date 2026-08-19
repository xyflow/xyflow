<script lang="ts">
  import { domNodeIsVisible } from '@xyflow/system';

  import { Panel } from '$lib/container/Panel/index.js';
  import type { AttributionProps } from './types.js';

  let { proOptions, position = 'bottom-right' }: AttributionProps = $props();

  const link = `https://svelteflow.dev${
    process.env.NODE_ENV === 'production' ? '?utm_source=attribution' : '/attribution'
  }`;

  const consoleLink = 'https://svelteflow.dev/remove-attribution?utm_source=console';

  let warned = false;

  if (process.env.NODE_ENV === 'development' && !warned) {
    setTimeout(() => {
      if (!domNodeIsVisible('.svelte-flow__attribution')) {
        console.warn(
          `Svelte Flow: It seems like you are hiding the attribution. Please only do this when you are subscribed to Svelte Flow Pro: ${consoleLink}\n%cYou can ignore this warning if you are subscribed.`,
          'font-style: italic;'
        );
      }
    }, 1000);

    warned = true;
  }
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
