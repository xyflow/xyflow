<script lang="ts">
  import { Position } from '@xyflow/system';

  import { Handle } from '$lib/components/Handle';
  import type { NodeProps } from '$lib/types';

  interface $$Props extends NodeProps {}

  export let data: $$Props['data'] = { label: 'Node' };
  export let targetPosition: $$Props['targetPosition'] = Position.Top;
  export let sourcePosition: $$Props['sourcePosition'] = Position.Bottom;

  // this is a workaround for suppressing the warning about unused props
  $$restProps;
</script>

<Handle type="target" position={targetPosition} />
{data?.label}
<Handle type="source" position={sourcePosition} />
