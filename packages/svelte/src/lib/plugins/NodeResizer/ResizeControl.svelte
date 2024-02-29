<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import cc from 'classcat';
  import { useStore } from '$lib/store';
  import {
    XYResizer,
    ResizeControlVariant,
    type ControlPosition,
    type XYResizerInstance,
    type XYResizerChange,
    type XYResizerChildChange
  } from '@xyflow/system';
  import type { ResizeControlProps } from './types';

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

  const { nodeLookup, snapGrid, viewport, nodes, nodeOrigin } = useStore();

  const contextNodeId = getContext<string>('svelteflow__node_id');
  $: id = typeof nodeId === 'string' ? nodeId : contextNodeId;

  let resizeControlRef: HTMLDivElement;
  let resizer: XYResizerInstance | null = null;

  $: defaultPosition = (
    variant === ResizeControlVariant.Line ? 'right' : 'bottom-right'
  ) as ControlPosition;
  $: controlPosition = position ?? defaultPosition;

  $: positionClassNames = controlPosition.split('-');

  $: colorStyleProp = variant === ResizeControlVariant.Line ? 'border-color' : 'background-color';
  $: _style = style ?? '';
  $: controlStyle = !!color ? `${_style} ${colorStyleProp}: ${color};` : _style;

  onMount(() => {
    if (resizeControlRef) {
      resizer = XYResizer({
        domNode: resizeControlRef,
        nodeId: id,
        getStoreItems: () => {
          return {
            nodeLookup: $nodeLookup,
            transform: [$viewport.x, $viewport.y, $viewport.zoom],
            snapGrid: $snapGrid ?? undefined,
            snapToGrid: !!$snapGrid,
            nodeOrigin: $nodeOrigin
          };
        },
        onChange: (change: XYResizerChange, childChanges: XYResizerChildChange[]) => {
          const node = $nodeLookup.get(id);
          if (node) {
            node.height = change.isHeightChange ? change.height : node.height;
            node.width = change.isWidthChange ? change.width : node.width;
            node.position =
              change.isXPosChange || change.isYPosChange
                ? { x: change.x, y: change.y }
                : node.position;

            for (const childChange of childChanges) {
              const childNode = $nodeLookup.get(childChange.id);
              if (childNode) {
                childNode.position = childChange.position;
              }
            }

            $nodes = $nodes;
          }
        }
      });
    }
    return () => {
      resizer?.destroy();
    };
  });

  $: {
    resizer?.update({
      controlPosition,
      boundaries: {
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
</script>

<div
  class={cc(['svelte-flow__resize-control', 'nodrag', ...positionClassNames, variant, className])}
  bind:this={resizeControlRef}
  style={controlStyle}
>
  <slot />
</div>
