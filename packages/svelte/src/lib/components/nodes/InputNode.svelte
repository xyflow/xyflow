<script lang="ts">
  import { Position } from '@xyflow/system';
  import type { NodeProps } from '$lib/types/index.js';

  import { Handle } from '$lib/components/Handle/index.js';

  let { data = { label: 'Node' }, sourcePosition = Position.Bottom }: NodeProps = $props();
</script>

{data?.label}
<Handle type="source" position={sourcePosition} />
