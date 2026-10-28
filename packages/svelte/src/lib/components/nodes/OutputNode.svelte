<script lang="ts">
  import { Position } from '@xyflow/system';
  import type { NodeProps } from '$lib/types/index.js';

  import { Handle } from '$lib/components/Handle/index.js';

  let { data = { label: 'Node' }, targetPosition = Position.Top }: NodeProps = $props();
</script>

{data?.label}
<Handle type="target" position={targetPosition} />
