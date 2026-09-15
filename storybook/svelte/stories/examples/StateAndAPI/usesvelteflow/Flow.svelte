<script lang="ts">
  import { SvelteFlow, Controls, Background, BackgroundVariant, MiniMap } from '@xyflow/svelte';

  import { defaultFlowProps } from '@shared/defaultFlow';
  import InteractionPanel from '@shared/InteractionPanel/InteractionPanel.svelte';
  import Sidebar from './Sidebar.svelte';

  import '@xyflow/svelte/dist/style.css';

  let nodes = $state.raw(structuredClone(defaultFlowProps.nodes));
  let edges = $state.raw(structuredClone(defaultFlowProps.edges));
</script>

<main>
  <SvelteFlow {...defaultFlowProps} bind:nodes bind:edges>
    <InteractionPanel />
    <Controls />
    <Background variant={BackgroundVariant.Dots} />
    <MiniMap />
  </SvelteFlow>
  <Sidebar />
</main>

<style>
  main {
    height: 100%;
    display: flex;
  }
</style>
