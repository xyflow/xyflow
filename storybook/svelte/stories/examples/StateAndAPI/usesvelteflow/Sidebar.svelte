<script lang="ts">
  import { useEdges, useNodes, useSvelteFlow, useViewport } from '@xyflow/svelte';

  const { zoomIn, zoomOut, setZoom, fitView, setCenter, setViewport, getViewport } = useSvelteFlow();

  let nodes = useNodes();
  let edges = useEdges();
  let viewport = useViewport();
</script>

<aside>
  <div class="label">Functions:</div>
  <button onclick={() => zoomIn()}>zoom in</button>
  <button onclick={() => zoomOut({ duration: 1000 })}>zoom out transition</button>
  <button onclick={() => setZoom(2)}>set zoom</button>
  <button onclick={() => fitView({ duration: 600 })}>fitView</button>
  <button onclick={() => fitView({ duration: 600, ease: (t) => +t, interpolate: 'linear' })}>fitView linear</button>
  <button onclick={() => setCenter(0, 0)}>setCenter 0, 0</button>
  <button onclick={() => setViewport({ x: 100, y: 100, zoom: 2 })}>setViewport</button>
  <button onclick={() => console.log(getViewport())}>getViewport</button>

  <div class="label">Nodes:</div>
  {#each nodes.current as node (node.id)}
    <div>id: {node.id} | x: {node.position.x.toFixed(1)} y: {node.position.y.toFixed(1)}</div>
  {/each}

  <div class="label">Viewport:</div>
  <div>
    x: {viewport.current.x.toFixed(1)} y: {viewport.current.y.toFixed(1)} zoom: {viewport.current.zoom.toFixed(1)}
  </div>
</aside>

<style>
  .label {
    font-weight: 700;
    margin: 0.5rem 0 0.25rem 0;
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
