<script lang="ts">
  import { getSmoothStepPath } from '@xyflow/system';

  import BaseEdge from './BaseEdge.svelte';
  import type { SmoothStepEdgeProps, EdgeProps } from '$lib/types';

  let {
    id,
    interactionWidth,
    label,
    labelStyle,
    style,
    markerEnd,
    markerStart,
    pathOptions,
    sourcePosition,
    sourceX,
    sourceY,
    targetPosition,
    targetX,
    targetY
  }: SmoothStepEdgeProps | EdgeProps = $props();

  let [path, labelX, labelY] = $derived(
    getSmoothStepPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
      borderRadius: pathOptions?.borderRadius,
      offset: pathOptions?.offset,
      stepPosition: pathOptions?.stepPosition
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
