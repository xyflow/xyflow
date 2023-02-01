<script lang="ts">
  import { Position } from '@reactflow/core';
  
  import Handle from '$lib/components/Handle.svelte';

  export let data: any = {};
  export let isConnectable: boolean = true;
  export let targetPosition: Position = Position.Top;
  export let sourcePosition: Position = Position.Bottom;
</script>

<Handle type="target" position={targetPosition} />
  {data?.label}
<Handle type="source" position={sourcePosition} />

