<script lang="ts">
  import { getStraightPath } from '@reactflow/edge-utils';

  import type { EdgeProps } from '$lib/types';
  import BaseEdge from './BaseEdge.svelte';

  type $$Props = EdgeProps;

  $: [path, labelX, labelY] = getStraightPath({
    sourceX: $$props.sourceX,
    sourceY: $$props.sourceY,
    targetX: $$props.targetX,
    targetY: $$props.targetY
  });
</script>

<BaseEdge {path} {labelX} {labelY} {...$$props} />
