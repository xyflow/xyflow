<script lang="ts">
  import { Position } from '@reactflow/system';
  
  import Handle from '$lib/components/Handle/index.svelte';
	import type { NodeProps } from '$lib/types';

  interface $$Props extends NodeProps<{ label: string }>{}

  export let id: $$Props['id'];
  export let data: $$Props['data'] = { label: 'Node' };
  export let isConnectable: $$Props['isConnectable'] = true;
  export let targetPosition: $$Props['targetPosition'] = Position.Top;
  export let sourcePosition: $$Props['sourcePosition'] = Position.Bottom;
  export let xPos: $$Props['xPos'];
  export let yPos: $$Props['yPos'];
  export let selected: $$Props['selected'];
</script>

<Handle type="target" position={targetPosition} />
{data?.label}
<Handle type="source" position={sourcePosition} />

