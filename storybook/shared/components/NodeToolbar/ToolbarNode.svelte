<script lang="ts">
  import { Handle, NodeToolbar, Position, type Node, type NodeProps } from '@xyflow/svelte';

  import type { ToolbarNodeData } from './config';

  const positionMap: Record<string, Position> = {
    top: Position.Top,
    right: Position.Right,
    bottom: Position.Bottom,
    left: Position.Left,
  };

  let { data }: NodeProps<Node<ToolbarNodeData>> = $props();

  const showInternalToolbar = $derived(data.renderMode !== 'external');
</script>

{#if showInternalToolbar}
  <NodeToolbar
    isVisible={data.isVisible}
    position={positionMap[data.position ?? 'top'] ?? Position.Top}
    offset={data.offset}
    align={data.align}
  >
    <button type="button">delete</button>
    <button type="button">copy</button>
    <button type="button">expand</button>
  </NodeToolbar>
{/if}
{data.label}
<Handle type="target" position={Position.Left} />
<Handle type="source" position={Position.Right} />
