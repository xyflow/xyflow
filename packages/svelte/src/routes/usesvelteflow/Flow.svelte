<script lang="ts">
  import SvelteFlow, {
    Controls,
    Background,
    BackgroundVariant,
    Minimap,
  } from '../../lib/index';
  import Sidebar from './Sidebar.svelte';
</script>

<main>
  <SvelteFlow
    fitView
  >
    <Controls />
    <Background variant={BackgroundVariant.Dots} />
    <Minimap />
  </SvelteFlow>
  <Sidebar />
</main>

<style>
  main {
    height: 100%;
    display: flex;
  }
</style>