<script lang="ts">
  import { getSmoothStepPath } from '@reactflow/edge-utils';

  import type { EdgeProps } from '$lib/types';
  import BaseEdge from './BaseEdge.svelte';

  type $$Props = EdgeProps;

  $: [path, labelX, labelY] = getSmoothStepPath({ 
    sourceX: $$props.sourceX,
    sourceY: $$props.sourceY,
    targetX: $$props.targetX,
    targetY: $$props.targetY,
    sourcePosition: $$props.sourcePosition,
    targetPosition: $$props.targetPosition,
  });
</script>

<BaseEdge
  {path}
  {labelX}
  {labelY}
  {...$$props}
/>