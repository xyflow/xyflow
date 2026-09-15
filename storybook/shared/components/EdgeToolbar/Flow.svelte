<script lang="ts">
  import { SvelteFlow, Background, Controls, type Node, type Edge } from '@xyflow/svelte';
  import { initialNodes, initialEdges } from './config';
  import CustomEdge from './CustomEdge.svelte';
  const edgeTypes = { custom: CustomEdge };
  let nodes = $state.raw<Node[]>(structuredClone(initialNodes) as Node[]);
  let edges = $state.raw<Edge[]>(structuredClone(initialEdges) as Edge[]);
</script>

<div style="height: 100vh;">
  <SvelteFlow bind:nodes bind:edges {edgeTypes} fitView minZoom={0.2} maxZoom={4}><Background /><Controls /></SvelteFlow
  >
</div>
