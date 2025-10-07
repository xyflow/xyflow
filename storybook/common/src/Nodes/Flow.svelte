<script lang="ts">
  import { SvelteFlow, Controls, Background, BackgroundVariant, MiniMap, type Node, type Edge } from '@xyflow/svelte';

  import '@xyflow/svelte/dist/style.css';
  import { initialNodes, initialEdges, type Props } from './data';

  let { nodeDragThreshold, classNames, minZoom, maxZoom, panOnDrag, zoomOnScroll, panOnScroll }: Props = $props();

  let nodes = $state.raw<Node[]>([...initialNodes]);
  let edges = $state.raw<Edge[]>([...initialEdges]);

  let x = 5;

  $effect(() => {
    x += 1;
  });
</script>

<SvelteFlow
  bind:nodes
  bind:edges
  class={classNames}
  {nodeDragThreshold}
  {minZoom}
  {maxZoom}
  {panOnDrag}
  {zoomOnScroll}
  {panOnScroll}
  fitView
>
  <Background variant={BackgroundVariant.Dots} />
  <MiniMap />
  <Controls />
</SvelteFlow>
