<script lang="ts">
  import { SvelteFlow, Controls, Background, BackgroundVariant, MiniMap, type Node, type Edge } from '@xyflow/svelte';

  import '@xyflow/svelte/dist/style.css';

  import { initialNodes, initialEdges, type Props } from './data';
  import { reactToSvelteEdges, reactToSvelteNodes } from '../utils';

  import DragHandleNode from './DragHandleNode.svelte';

  let {}: Props = $props();

  let nodes = $state.raw<Node[]>(reactToSvelteNodes(initialNodes));
  let edges = $state.raw<Edge[]>(reactToSvelteEdges(initialEdges));
  const nodeTypes = {
    DragHandleNode,
  };
</script>

<SvelteFlow bind:nodes bind:edges {nodeTypes} fitView>
  <Background variant={BackgroundVariant.Dots} />
  <MiniMap />
  <Controls />
</SvelteFlow>
