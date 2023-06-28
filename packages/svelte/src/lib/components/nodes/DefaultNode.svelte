<script lang="ts">
  import { Position, type NodeProps } from '@xyflow/system';

  import { Handle } from '$lib/components/Handle';

  interface $$Props extends NodeProps<{ label: string }> {}

  export let data: $$Props['data'] = { label: 'Node' };
  export let targetPosition: $$Props['targetPosition'] = Position.Top;
  export let sourcePosition: $$Props['sourcePosition'] = Position.Bottom;
</script>

<Handle type="target" position={targetPosition} on:connectstart on:connect on:connectend />
{data?.label}
<Handle type="source" position={sourcePosition} on:connectstart on:connect on:connectend />
