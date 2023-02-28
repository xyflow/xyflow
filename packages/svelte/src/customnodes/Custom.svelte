<script lang="ts">
  import Handle from '$lib/components/Handle/index.svelte';
  import { Position } from '@reactflow/system';

  export let data: { label: string } = { label: 'Node' };
  export let xPos: number = 0;
  export let yPos: number = 0;
</script>

<div class="custom">
  <div>{data.label}</div>
  <div>{~~xPos}, {~~yPos}</div>
  <Handle type="target" position={Position.Top} />
  <Handle type="source" position={Position.Bottom} />
</div>

<style>
  .custom {
    background: #ffcc00;
    padding: 10px;
  }
</style>
