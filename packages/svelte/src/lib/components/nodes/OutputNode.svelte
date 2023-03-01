<script lang="ts">
  import { Position } from '@reactflow/system';

  import { Handle } from '$lib/components/Handle';

  export let data: { label: string } = { label: 'Node' };
  export let isConnectable: boolean = true;
  export let targetPosition: Position = Position.Top;
</script>

{data?.label}
<Handle type="target" position={targetPosition} />
