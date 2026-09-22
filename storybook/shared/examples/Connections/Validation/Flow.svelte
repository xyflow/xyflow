<script lang="ts">
  import { SvelteFlow, type Node, type Edge } from '@xyflow/svelte';
  import { initialNodes, isValidConnection } from './config';
  import ValidationNode from './ValidationNode.svelte';
  import ConnectionStatus from './ConnectionStatus.svelte';
  const nodeTypes = { custominput: ValidationNode, customnode: ValidationNode };
  let nodes = $state.raw<Node[]>(structuredClone(initialNodes) as Node[]);
  let edges = $state.raw<Edge[]>([]);
</script>

<div style="height: 100vh;">
  <SvelteFlow bind:nodes bind:edges {nodeTypes} {isValidConnection} edgesReconnectable selectNodesOnDrag={false} fitView
    ><ConnectionStatus /></SvelteFlow
  >
</div>
