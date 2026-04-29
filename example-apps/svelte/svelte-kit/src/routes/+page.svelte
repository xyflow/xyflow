<script lang="ts">
  import { SvelteFlow, Controls, Background, BackgroundVariant, Position } from '@xyflow/svelte';

  import '@xyflow/svelte/style.css';

  let nodes = $state.raw([
    { id: 'A', position: { x: 0, y: 0 }, data: { label: 'A' } },
    { id: 'B', position: { x: 250, y: 150 }, data: { label: 'B' } },
    { id: 'C', position: { x: 0, y: 300 }, data: { label: 'C' } },
  ]);

  let edges = $state.raw([
    { id: 'A-B', source: 'A', target: 'B' },
    { id: 'B-C', source: 'B', target: 'C' },
  ]);
</script>

<SvelteFlow bind:nodes bind:edges fitView>
  <Controls />
  <Background variant={BackgroundVariant.Dots} />
</SvelteFlow>

<style>
  :global(html, body) {
    height: 100%;
    margin: 0;
  }
</style>
