<script lang="ts">
  import { Panel } from '$lib/container/Panel';
  import type { AttributionProps } from './types';

  type $$Props = AttributionProps;

  export let proOptions: AttributionProps['proOptions'] = undefined;
  export let position: AttributionProps['position'] = 'bottom-right';
</script>


{#if !proOptions?.hideAttribution}
  <Panel
    position={position}
    class="svelte-flow__attribution"
    data-message="Please only hide this attribution when you are subscribed to Svelte Flow Pro: https://pro.reactflow.dev"
  >
    <a href="https://reactflow.dev/svelte" target="_blank" rel="noopener noreferrer" aria-label="Svelte Flow attribution">
      Svelte Flow
    </a>
  </Panel>
{/if}

<style>
  :global(.svelte-flow__panel.svelte-flow__attribution) {
    font-size: 10px;
    background: rgba(255, 255, 255, 0.5);
    padding: 2px 3px;
    margin: 0;
  }

  :global(.svelte-flow__attribution) a {
    text-decoration: none;
    color: #999;
  }
</style>