<script lang="ts">
  import { untrack } from 'svelte';
  import {
    Handle,
    Position,
    useNodeConnections,
    useNodesData,
    useSvelteFlow,
    type Node,
    type NodeProps,
  } from '@xyflow/svelte';
  import { type MyNode } from './Flow.svelte';

  let { id, data }: NodeProps<Node<{ text: string }>> = $props();

  const { updateNodeData } = useSvelteFlow();
  const connections = useNodeConnections(() => ({
    handleType: 'target',
  }));

  const nodesData = useNodesData<MyNode>(() => ({ nodeIds: connections.current[0]?.source }));

  $effect.pre(() => {
    const text = nodesData.current?.type === 'text' ? nodesData.current?.data.text.toUpperCase() : undefined;
    if (untrack(() => data.text) !== text) {
      untrack(() => updateNodeData(id, { text }));
    }
  });
</script>

<div class="custom">
  <Handle type="target" position={Position.Left} isConnectable={connections.current.length === 0} />
  <div>uppercase transform</div>
  <Handle type="source" position={Position.Right} />
</div>

<style>
  .custom {
    background-color: #eee;
    padding: 10px;
    border-radius: 10px;
  }
</style>
