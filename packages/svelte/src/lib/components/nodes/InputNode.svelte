<script lang="ts">
  import { Position, type NodeProps } from '@xyflow/system';

  import { Handle } from '$lib/components/Handle';

  interface $$Props extends NodeProps<{ label: string }> {}

  export let data: $$Props['data'] = { label: 'Node' };
  export let sourcePosition: $$Props['sourcePosition'] = Position.Bottom;
</script>

{data?.label}
<Handle type="source" position={sourcePosition} on:connectstart on:connect on:connectend />
