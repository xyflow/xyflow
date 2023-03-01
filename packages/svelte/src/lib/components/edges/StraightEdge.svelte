<script lang="ts">
  import { getStraightPath } from '@reactflow/edge-utils';

  import type { EdgeProps } from '$lib/types';
  import { BaseEdge } from '$lib/components/BaseEdge';

  type $$Props = EdgeProps;

  $: [path, labelX, labelY] = getStraightPath({
    sourceX: $$props.sourceX,
    sourceY: $$props.sourceY,
    targetX: $$props.targetX,
    targetY: $$props.targetY
  });
</script>

<BaseEdge {path} {labelX} {labelY} {...$$props} />
