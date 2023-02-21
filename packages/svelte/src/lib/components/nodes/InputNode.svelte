<script lang="ts">
  import { Position } from '@reactflow/system';
  
  import Handle from '$lib/components/Handle/index.svelte';

  export let data: { label: string } = { label: 'Node' };
  export let isConnectable: boolean = true;
  export let sourcePosition: Position = Position.Bottom;
</script>

{data?.label}
<Handle type="source" position={sourcePosition} />

