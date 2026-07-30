<script lang="ts">
  import { Position } from '@xyflow/system';

  import { Handle } from '$lib/components/Handle/index.js';
  import type { NodeProps } from '$lib/types/index.js';

  let {
    data,
    targetPosition = Position.Top,
    sourcePosition = Position.Bottom
  }: NodeProps = $props();
</script>

<Handle type="target" position={targetPosition} />
{data?.label}
<Handle type="source" position={sourcePosition} />
