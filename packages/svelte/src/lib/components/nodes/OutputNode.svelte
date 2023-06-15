<script lang="ts">
  import { Position, type NodeProps } from '@xyflow/system';

  import { Handle } from '$lib/components/Handle';

  interface $$Props extends NodeProps<{ label: string }> {}

  export let data: $$Props['data'] = { label: 'Node' };
  export let targetPosition: $$Props['targetPosition'] = Position.Top;
</script>

{data?.label}
<Handle type="target" position={targetPosition} on:connect:start on:connect on:connect:end />
