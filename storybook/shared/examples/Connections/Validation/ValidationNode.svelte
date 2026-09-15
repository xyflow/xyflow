<script lang="ts">
  import { Handle, Position, type NodeProps } from '@xyflow/svelte';
  let { id, type }: NodeProps = $props();
</script>

<div
  style="width: 150px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; background: #eee; color: #555; text-align: center;"
>
  {#if type !== 'custominput'}<Handle type="target" position={Position.Top} isConnectableStart={false} />{/if}
  <div>{type === 'custominput' ? 'Only connectable with B' : id}</div>
  <Handle type="source" position={Position.Right} />
</div>
