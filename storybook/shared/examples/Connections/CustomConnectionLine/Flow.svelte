<script lang="ts">
  import { SvelteFlow, Background, type Node, type Edge } from '@xyflow/svelte';
  import { defaultFlowProps } from '../../../defaultFlow';
  import ConnectionLine from './ConnectionLine.svelte';
  let nodes = $state.raw<Node[]>(structuredClone(defaultFlowProps.nodes));
  let edges = $state.raw<Edge[]>(structuredClone(defaultFlowProps.edges));
</script>

<div style="height: 100vh;">
  <SvelteFlow
    {...defaultFlowProps}
    bind:nodes
    bind:edges
    connectionLineComponent={ConnectionLine}
    connectionDragThreshold={25}><Background /></SvelteFlow
  >
</div>
