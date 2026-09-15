<script lang="ts">
  import { SvelteFlow, Controls, Background, type Node, type Edge } from '@xyflow/svelte';
  import initialFlow from './config';
  import { layoutNodes } from './layout';
  import LayoutActions from './LayoutActions.svelte';
  import InteractionPanel from '../../../InteractionPanel/InteractionPanel.svelte';
  let nodes = $state.raw<Node[]>(layoutNodes(structuredClone(initialFlow.nodes), initialFlow.edges, 'TB') as Node[]);
  let edges = $state.raw<Edge[]>(structuredClone(initialFlow.edges) as Edge[]);
</script>

<div style="height: 100vh;">
  <SvelteFlow bind:nodes bind:edges fitView><Background /><Controls /><InteractionPanel /><LayoutActions /></SvelteFlow>
</div>
