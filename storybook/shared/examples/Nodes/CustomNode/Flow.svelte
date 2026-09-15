<script lang="ts">
  import { SvelteFlow, Background, Controls, type Node, type Edge } from '@xyflow/svelte';
  import { defaultFlowProps } from '../../../defaultFlow';
  import { initialNodes, initialEdges } from './config';
  import ColorNode from './ColorNode.svelte';
  const nodeTypes = { color: ColorNode };
  let nodes = $state.raw<Node[]>(structuredClone(initialNodes));
  let edges = $state.raw<Edge[]>(structuredClone(initialEdges));
</script>

<div style="height: 100vh;">
  <SvelteFlow {...defaultFlowProps} bind:nodes bind:edges {nodeTypes}>
    <Background bgColor={String(nodes.find((node) => node.id === '2')?.data.color ?? '#fff')} /><Controls />
  </SvelteFlow>
</div>
