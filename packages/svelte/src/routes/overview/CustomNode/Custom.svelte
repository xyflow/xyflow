<script lang="ts">
  import { Position } from '@xyflow/system';
  import { Handle } from '../../../lib/index';

  export let data: { label: string } = { label: 'Node' };
  export let xPos: number = 0;
  export let yPos: number = 0;
</script>

<div class="custom">
  <div>{data.label}</div>
  <div>{~~xPos}, {~~yPos}</div>

  <Handle type="target" position={Position.Top} />

  <Handle type="source" position={Position.Bottom} style="left: 10%;" id="a" />
  <Handle type="source" position={Position.Bottom} id="b" />
  <Handle type="source" position={Position.Bottom} style="left: 90%;" id="c" />
</div>

<style>
  .custom {
    background: #ffcc00;
    padding: 10px;
  }
</style>
