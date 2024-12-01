<script lang="ts">
  import { Position } from '@xyflow/system';
  import type { LabeledBuiltInNode, NodeProps } from '$lib/types';

  import { Handle } from '$lib/components/Handle';

  type $$Props = NodeProps<LabeledBuiltInNode>;

  export let data: $$Props['data'] = { label: 'Node' };
  export let sourcePosition: $$Props['sourcePosition'] = undefined;

  // this is a workaround for suppressing the warning about unused props
  $$restProps;
</script>

{data?.label}
<Handle type="source" position={sourcePosition ?? Position.Bottom} />
