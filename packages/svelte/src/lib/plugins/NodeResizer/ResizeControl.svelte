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
  import { get } from 'svelte/store';

  let {
    nodeId,
    position,
    variant = ResizeControlVariant.Handle,
    color,
    minWidth = 10,
    minHeight = 10,
    maxWidth = Number.MAX_VALUE,
    maxHeight = Number.MAX_VALUE,
    keepAspectRatio = false,
    shouldResize,
    onResizeStart,
    onResize,
    onResizeEnd,
    style = '',
    class: className,
    children
  }: ResizeControlProps = $props();

  const store = useStore();

  let id = $derived(
    typeof nodeId === 'string' ? nodeId : getContext<string>('svelteflow__node_id')
  );

  let resizeControlRef: HTMLDivElement;
  let resizer: XYResizerInstance | null = $state(null);

  let controlPosition = $derived.by(() => {
    let defaultPosition = (
      variant === ResizeControlVariant.Line ? 'right' : 'bottom-right'
    ) as ControlPosition;
    return position ?? defaultPosition;
  });

  let positionClassNames = $derived(controlPosition.split('-'));

  let controlStyle = $derived.by(() => {
    let colorStyleProp =
      variant === ResizeControlVariant.Line ? 'border-color' : 'background-color';
    return color ? `${style} ${colorStyleProp}: ${color};` : style;
  });

  onMount(() => {
    if (resizeControlRef) {
      resizer = XYResizer({
        domNode: resizeControlRef,
        nodeId: id,
        getStoreItems: () => {
          return {
            nodeLookup: store.nodeLookup,
            transform: [store.viewport.x, store.viewport.y, store.viewport.zoom],
            snapGrid: store.snapGrid ?? undefined,
            snapToGrid: !!store.snapGrid,
            nodeOrigin: store.nodeOrigin,
            paneDomNode: store.domNode
          };
        },
        onChange: (change: XYResizerChange, childChanges: XYResizerChildChange[]) => {
          const node = store.nodeLookup.get(id)?.internals.userNode;
          if (!node) {
            return;
          }

          if (change.x !== undefined && change.y !== undefined) {
            node.position = { x: change.x, y: change.y };
          }

          if (change.width !== undefined && change.height !== undefined) {
            node.width = change.width;
            node.height = change.height;
          }

          for (const childChange of childChanges) {
            const childNode = store.nodeLookup.get(childChange.id)?.internals.userNode;
            if (childNode) {
              childNode.position = childChange.position;
            }
          }

          // store.nodes.set(get(store.nodes));
        }
      });
    }
    return () => {
      resizer?.destroy();
    };
  });

  $effect.pre(() => {
    resizer?.update({
      controlPosition,
      boundaries: {
        minWidth,
        minHeight,
        maxWidth,
        maxHeight
      },
      keepAspectRatio: !!keepAspectRatio,
      onResizeStart,
      onResize,
      onResizeEnd,
      shouldResize
    });
  });
</script>

<div
  class={cc(['svelte-flow__resize-control', 'nodrag', ...positionClassNames, variant, className])}
  bind:this={resizeControlRef}
  style={controlStyle}
>
  {@render children?.()}
</div>
