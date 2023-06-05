<script lang="ts">
  import { Position, type NodeProps } from '@xyflow/system';

  import { Handle } from '$lib/components/Handle';

  interface $$Props extends NodeProps<{ label: string }> {}

  export let id: $$Props['id'];
  export let data: $$Props['data'] = { label: 'Node' };
  export let targetPosition: $$Props['targetPosition'] = Position.Top;
  export let sourcePosition: $$Props['sourcePosition'] = Position.Bottom;
  export let xPos: $$Props['xPos'];
  export let yPos: $$Props['yPos'];
  export let selected: $$Props['selected'] = false;
</script>

{data?.label}
<Handle type="source" position={sourcePosition} on:connect:start on:connect on:connect:end />
