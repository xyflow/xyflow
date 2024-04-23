<script lang="ts">
  import ResizeControl from './ResizeControl.svelte';
  import type { NodeResizerProps } from './types';
  import {
    ResizeControlVariant,
    XY_RESIZER_HANDLE_POSITIONS,
    XY_RESIZER_LINE_POSITIONS
  } from '@xyflow/system';

  let {
    nodeId,
    isVisible = true,
    handleClass,
    handleStyle,
    lineClass,
    lineStyle,
    color,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    keepAspectRatio = false,
    shouldResize,
    onResizeStart,
    onResize,
    onResizeEnd
  }: NodeResizerProps = $props();
</script>

{#if isVisible}
  {#each XY_RESIZER_LINE_POSITIONS as position (position)}
    <ResizeControl
      class={lineClass}
      style={lineStyle}
      {nodeId}
      {position}
      variant={ResizeControlVariant.Line}
      {color}
      {minWidth}
      {minHeight}
      {maxWidth}
      {maxHeight}
      {onResizeStart}
      {keepAspectRatio}
      {shouldResize}
      {onResize}
      {onResizeEnd}
    />
  {/each}
  {#each XY_RESIZER_HANDLE_POSITIONS as position (position)}
    <ResizeControl
      class={handleClass}
      style={handleStyle}
      {nodeId}
      {position}
      {color}
      {minWidth}
      {minHeight}
      {maxWidth}
      {maxHeight}
      {onResizeStart}
      {keepAspectRatio}
      {shouldResize}
      {onResize}
      {onResizeEnd}
    />
  {/each}
{/if}
