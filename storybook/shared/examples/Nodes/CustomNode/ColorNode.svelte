<script lang="ts">
  import { Handle, Position, useSvelteFlow, type Node, type NodeProps } from '@xyflow/svelte';
  let { id, data }: NodeProps<Node<{ color: string }>> = $props();
  const { updateNodeData } = useSvelteFlow();
</script>

<div style="background: white; color: #222; padding: 12px; border: 1px solid #777; border-radius: 8px;">
  <Handle type="target" position={Position.Top} />
  <label
    >Node color <input
      aria-label="Node color"
      class="nodrag nokey"
      type="color"
      value={data.color}
      oninput={(event) => updateNodeData(id, { color: event.currentTarget.value })}
    /></label
  >
  <Handle type="source" position={Position.Bottom} />
</div>
