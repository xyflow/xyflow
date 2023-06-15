<script lang="ts">
  import { Handle, Position, type NodeProps } from '../../../lib/index';

  type $$Props = NodeProps;

  export let id: string;
  export let xPos: number = 0;
  export let yPos: number = 0;
  export let zIndex: number = 0;
</script>

<Handle type="target" position={Position.Top} />
<div>{id}</div>
<div>
  x:{Math.round(xPos || 0)} y:{Math.round(yPos || 0)} z:{zIndex}
</div>
<Handle type="source" position={Position.Bottom} />

<style>
  .custom {
    background: #ffcc00;
    padding: 10px;
  }
</style>
