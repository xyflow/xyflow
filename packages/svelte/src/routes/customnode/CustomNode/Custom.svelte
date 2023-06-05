<script lang="ts">
  import { Position } from '@xyflow/system';
  import { Handle } from '../../../lib/index';

  export let data: { color: string, onChange: () => void } = { color: '#111', onChange: () => {} };
  export let xPos: number = 0;
  export let yPos: number = 0;
</script>

<Handle type="target" position={Position.Left} />
<div>
  Custom Color Picker Node: <strong>{data.color}</strong>
</div>
<input class="nodrag" type="color" on:input={data.onChange} value={data.color} />
<Handle
  type="source"
  position={Position.Right}
  id="a"
  style="top: 10px;"
/>
<Handle type="source" position={Position.Right} id="b" style="top: auto; bottom: 10px;"  />
