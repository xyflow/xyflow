<script lang="ts">
  import { Handle, NodeToolbar, Position, type NodeProps } from '@xyflow/svelte';

  const positionMap: Record<string, Position> = {
    top: Position.Top,
    right: Position.Right,
    bottom: Position.Bottom,
    left: Position.Left,
  };

  let { data }: NodeProps = $props();
</script>

<NodeToolbar
  isVisible={typeof data.toolbarVisible === 'boolean' ? data.toolbarVisible : undefined}
  position={positionMap[String(data.toolbarPosition)] ?? Position.Top}
  align={data.toolbarAlign}
>
  <button type="button">delete</button>
  <button type="button">copy</button>
  <button type="button">expand</button>
</NodeToolbar>
<div class="node">
  <div>{data.label}</div>
  <Handle type="target" position={Position.Left} />
  <Handle type="source" position={Position.Right} />
</div>

<style>
  .node {
    width: 200px;
    height: 50px;
    border: solid 1px black;
  }
</style>
