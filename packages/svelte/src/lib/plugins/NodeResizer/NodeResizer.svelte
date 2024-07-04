<script lang="ts">
  import ResizeControl from './ResizeControl.svelte';
  import type { NodeResizerProps } from './types';
  import {
    ResizeControlVariant,
    XY_RESIZER_HANDLE_POSITIONS,
    XY_RESIZER_LINE_POSITIONS
  } from '@xyflow/system';

  type $$Props = NodeResizerProps;

  export let nodeId: $$Props['nodeId'] = undefined;
  export let isVisible: $$Props['isVisible'] = true;
  export let handleClass: $$Props['handleClass'] = undefined;
  export let handleStyle: $$Props['handleStyle'] = undefined;
  export let lineClass: $$Props['lineClass'] = undefined;
  export let lineStyle: $$Props['lineStyle'] = undefined;
  export let color: $$Props['color'] = undefined;
  export let minWidth: $$Props['minWidth'] = 10;
  export let minHeight: $$Props['minHeight'] = 10;
  export let maxWidth: $$Props['maxWidth'] = Number.MAX_VALUE;
  export let maxHeight: $$Props['maxHeight'] = Number.MAX_VALUE;
  export let keepAspectRatio: $$Props['keepAspectRatio'] = false;
  export let shouldResize: $$Props['shouldResize'] = undefined;
  export let onResizeStart: $$Props['onResizeStart'] = undefined;
  export let onResize: $$Props['onResize'] = undefined;
  export let onResizeEnd: $$Props['onResizeEnd'] = undefined;

  let _minWidth = minWidth || 10;
  let _minHeight = minHeight || 10;
  let _maxWidth = maxWidth || Number.MAX_VALUE;
  let _maxHeight = maxHeight || Number.MAX_VALUE;
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
      minWidth={_minWidth}
      minHeight={_minHeight}
      maxWidth={_maxWidth}
      maxHeight={_maxHeight}
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
      minWidth={_minWidth}
      minHeight={_minHeight}
      maxWidth={_maxWidth}
      maxHeight={_maxHeight}
      {onResizeStart}
      {keepAspectRatio}
      {shouldResize}
      {onResize}
      {onResizeEnd}
    />
  {/each}
{/if}
