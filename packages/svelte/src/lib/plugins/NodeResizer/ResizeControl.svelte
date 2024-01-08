<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import { get } from 'svelte/store';
  import cc from 'classcat';
  import type { ResizeControlProps } from './types';
  import {
    ResizeControlVariant,
    type XYResizeControlPosition,
    type XYResizerInstance,
    XYResizer,
    type XYResizeChange
  } from '@xyflow/system';
  import { useStore } from '$lib/store';

  type $$Props = ResizeControlProps;

  export let nodeId: $$Props['nodeId'] = undefined;
  export let position: $$Props['position'] = undefined;
  export let variant: $$Props['variant'] = ResizeControlVariant.Handle;
  export let color: $$Props['color'] = undefined;
  export let minWidth: $$Props['minWidth'] = 10;
  $: _minWidth = minWidth ?? 10;
  export let minHeight: $$Props['minHeight'] = 10;
  $: _minHeight = minHeight ?? 10;
  export let maxWidth: $$Props['maxWidth'] = Number.MAX_VALUE;
  $: _maxWidth = maxWidth ?? Number.MAX_VALUE;
  export let maxHeight: $$Props['maxHeight'] = Number.MAX_VALUE;
  $: _maxHeight = maxHeight ?? Number.MAX_VALUE;
  export let keepAspectRatio: $$Props['keepAspectRatio'] = false;
  export let shouldResize: $$Props['shouldResize'] = undefined;
  export let onResizeStart: $$Props['onResizeStart'] = undefined;
  export let onResize: $$Props['onResize'] = undefined;
  export let onResizeEnd: $$Props['onResizeEnd'] = undefined;
  export let style: $$Props['style'] = '';
  let className: $$Props['class'] = '';
  export { className as class };

  const { nodeLookup, snapGrid, viewport, nodes } = useStore();

  const contextNodeId = getContext<string>('svelteflow__node_id');
  $: id = typeof nodeId === 'string' ? nodeId : contextNodeId;

  let resizeControlRef: HTMLDivElement;
  let resizer: XYResizerInstance | null = null;

  $: defaultPosition = (
    variant === ResizeControlVariant.Line ? 'right' : 'bottom-right'
  ) as XYResizeControlPosition;
  $: controlPosition = position ?? defaultPosition;

  $: positionClassNames = controlPosition.split('-');

  $: colorStyleProp = variant === ResizeControlVariant.Line ? 'border-color' : 'background-color';
  $: _style = style ?? '';
  $: controlStyle = !!color ? `${_style} ${colorStyleProp}: ${color};` : _style;

  function updateNodes() {
    $nodes = $nodes;
  }

  onMount(() => {
    return () => {
      resizer?.destroy();
    };
  });

  $: {
    if (resizeControlRef) {
      if (!resizer) {
        const _snapGrid = get(snapGrid);
        const _viewport = get(viewport);
        resizer = XYResizer({
          domNode: resizeControlRef,
          nodeId: id,
          getStoreItems: () => {
            return {
              nodeLookup: get(nodeLookup),
              transform: [_viewport.x, _viewport.y, _viewport.zoom],
              snapGrid: _snapGrid ?? undefined,
              snapToGrid: !!_snapGrid
            };
          },
          onChange: (change: XYResizeChange) => {
            const _nodeLookup = get(nodeLookup);
            const node = _nodeLookup.get(id);
            if (node) {
              if (change.isHeightChange) {
                node.height = change.height;
              }

              if (change.isWidthChange) {
                node.width = change.width;
              }

              if (change.isXPosChange || change.isYPosChange) {
                node.position = { x: change.x, y: change.y };
              }
              // This needs to be a function to prevent unnecessary updates
              updateNodes();
            }
          }
        });
      }

      resizer.update({
        controlPosition,
        boundries: {
          minWidth: _minWidth,
          minHeight: _minHeight,
          maxWidth: _maxWidth,
          maxHeight: _maxHeight
        },
        keepAspectRatio: !!keepAspectRatio,
        onResizeStart,
        onResize,
        onResizeEnd,
        shouldResize
      });
    }
  }
</script>

<div
  class={cc(['svelte-flow__resize-control', 'nodrag', ...positionClassNames, variant, className])}
  bind:this={resizeControlRef}
  style={controlStyle}
>
  <slot />
</div>
