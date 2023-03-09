<script lang="ts">
  import SvelteFlow, {
    Controls,
    Background,
    BackgroundVariant,
    Minimap,
    Panel,
    useSvelteFlow
  } from '../../lib/index';
 
  const svelteFlow = useSvelteFlow();
</script>

<SvelteFlow>
  <Controls />
  <Background variant={BackgroundVariant.Dots} />
  <Minimap />
  <Panel position="top-right">
    <button on:click={() => svelteFlow.zoomIn()}>zoom in</button>
    <button on:click={() => svelteFlow.zoomOut({ duration: 1000 })}>zoom out transition</button>
    <button on:click={() => svelteFlow.fitView()}>fitView</button>
  </Panel>
</SvelteFlow>
