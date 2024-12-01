<script lang="ts">
  import { Position } from '@xyflow/system';

  import { Handle } from '$lib/components/Handle';
  import type { LabeledBuiltInNode, NodeProps } from '$lib/types';

  type $$Props = NodeProps<LabeledBuiltInNode>;

  export let data: $$Props['data'] = { label: 'Node' };
  export let targetPosition: $$Props['targetPosition'] = undefined;
  export let sourcePosition: $$Props['sourcePosition'] = undefined;

  // this is a workaround for suppressing the warning about unused props
  $$restProps;
</script>

<Handle type="target" position={targetPosition ?? Position.Top} />
{data?.label}
<Handle type="source" position={sourcePosition ?? Position.Bottom} />
