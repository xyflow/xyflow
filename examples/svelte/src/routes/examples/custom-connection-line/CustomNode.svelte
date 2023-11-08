<script lang="ts">
  import { Handle, Position, type NodeProps } from '@xyflow/svelte';

  type $$Props = NodeProps;

  export let isConnectable: $$Props['isConnectable'];

  const DEFAULT_HANDLE_STYLE = 'width: 10px; height: 10px; bottom: -5px;';
</script>

<div style="background: #DDD; padding: 25px">
  <div>Node</div>
  <Handle
    type="source"
    id="red"
    position={Position.Bottom}
    style={DEFAULT_HANDLE_STYLE + 'left: 15%; background: red;'}
    {isConnectable}
  />
  <Handle
    type="source"
    position={Position.Bottom}
    id="blue"
    style={DEFAULT_HANDLE_STYLE + 'left: 50%; background: blue;'}
    {isConnectable}
  />
  <Handle
    type="source"
    position={Position.Bottom}
    id="orange"
    style={DEFAULT_HANDLE_STYLE + 'left: 85%; background: orange;'}
    {isConnectable}
  />
</div>
