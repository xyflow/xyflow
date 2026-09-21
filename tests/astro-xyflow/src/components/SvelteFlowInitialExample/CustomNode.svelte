<script lang="ts">
  import { Handle, Position, type NodeProps } from '@xyflow/svelte';

  type $$Props = NodeProps;

  let text = 'some default text';
</script>

<Handle type="target" position={Position.Left} />
<div class="custom">
  <div>
    text: {text}
  </div>
  <input type="text" bind:value={text} />
</div>
<Handle type="source" position={Position.Right} />

<style>
  .custom {
    background-color: white;
    padding: 10px;
    border: 1px solid #777;
    border-radius: 20px;
  }
</style>
