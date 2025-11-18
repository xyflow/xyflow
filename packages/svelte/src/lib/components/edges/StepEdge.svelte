<script lang="ts">
  import { getSmoothStepPath } from '@xyflow/system';

  import BaseEdge from './BaseEdge.svelte';
  import type { StepEdgeProps, EdgeProps } from '$lib/types';

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
  }: StepEdgeProps | EdgeProps = $props();

  let [path, labelX, labelY] = $derived(
    getSmoothStepPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
      borderRadius: 0,
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
