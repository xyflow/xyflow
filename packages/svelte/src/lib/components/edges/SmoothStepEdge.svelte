<script lang="ts">
  import { getSmoothStepPath } from '@xyflow/system';

  import type { SmoothStepEdgeProps } from '$lib/types';
  import { BaseEdge } from '$lib/components/BaseEdge';

  let {
    id,
    label,
    labelStyle,
    style,
    markerStart,
    markerEnd,
    pathOptions,
    interactionWidth,
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  }: SmoothStepEdgeProps = $props();

  let [path, labelX, labelY] = $derived(
    getSmoothStepPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
      borderRadius: pathOptions?.borderRadius,
      offset: pathOptions?.offset
    })
  );
</script>

<BaseEdge
  {id}
  {path}
  {labelX}
  {labelY}
  {label}
  {labelStyle}
  {markerStart}
  {markerEnd}
  {interactionWidth}
  {style}
/>
