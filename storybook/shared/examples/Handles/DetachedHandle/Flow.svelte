<script lang="ts">
  import { SvelteFlow, Background, type Node, type Edge } from '@xyflow/svelte';
  import { initialNodes } from './config';
  import CustomNode from './CustomNode.svelte';
  const nodeTypes = { detached: CustomNode };
  let nodes = $state.raw<Node[]>(structuredClone(initialNodes));
  let edges = $state.raw<Edge[]>([]);
</script>

<div style="height: 100vh;">
  <SvelteFlow bind:nodes bind:edges {nodeTypes} connectionRadius={10} fitView><Background /></SvelteFlow>
</div>
