<script lang="ts">
  import {
    useSvelteFlow
  } from '../../lib/index';

  const { zoomIn, zoomOut, fitView, viewport, nodes } = useSvelteFlow();
</script>

<aside>
  <div class="label">Functions:</div>
  <button on:click={() => zoomIn()}>zoom in</button>
  <button on:click={() => zoomOut({ duration: 1000 })}>zoom out transition</button>
  <button on:click={() => fitView()}>fitView</button>

  <div class="label">Nodes:</div>
  {#each $nodes as node (node.id)}
    <div>id: {node.id} | x: {node.position.x.toFixed(1)} y: {node.position.y.toFixed(1)}</div>
  {/each}

  <div class="label">Viewport:</div>
  <div>x: {$viewport.x.toFixed(1)} y: {$viewport.y.toFixed(1)} zoom: {$viewport.zoom.toFixed(1)}</div>
</aside>

<style>
  .label {
    font-weight: 700;
    margin: 0.5rem 0 .25rem 0;
  }

  aside {
    width: 20vw;
    background: #f4f4f4;
    padding: 0.4rem 0.8rem;
    font-size: 12px;
  }

  button {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 12px;
  }
</style>