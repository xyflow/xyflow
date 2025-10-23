<script lang="ts">
  import { SvelteFlow, Controls, Background, BackgroundVariant, MiniMap, type Node, type Edge } from '@xyflow/svelte';

  import '@xyflow/svelte/dist/style.css';
  import { initialNodes, initialEdges, type Props } from './data';
  let { className, ...props }: Props = $props();

  let nodes = $state.raw<Node[]>([...initialNodes]);
  let edges = $state.raw<Edge[]>([...initialEdges]);
</script>

<SvelteFlow bind:nodes bind:edges class={className} fitView {...props}>
  <Background variant={BackgroundVariant.Dots} />
  <MiniMap />
  <Controls />
</SvelteFlow>
