<script lang="ts">
  import { onMount } from 'svelte';

  import { useSvelteFlowStore } from '#lib/store/index.js';
  import { getNodeIdContext } from '#lib/store/context.js';
  import {
    XYResizer,
    ResizeControlVariant,
    type ControlPosition,
    type XYResizerInstance,
    type XYResizerChange,
    type XYResizerChildChange,
    type NodeChange,
    positionChange
  } from '@xyflow/system';

  import type { ResizeControlProps } from './types.js';

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
    resizeDirection,
    autoScale = true,
    shouldResize,
    onResizeStart,
    onResize,
    onResizeEnd,
    class: className,
    children,
    ...rest
  }: ResizeControlProps = $props();

  const store = useSvelteFlowStore();
  const contextNodeId = getNodeIdContext();

  let id = $derived(typeof nodeId === 'string' ? nodeId : contextNodeId);

  // svelte-ignore state_referenced_locally
  if (!id) {
    throw new Error('Either pass a nodeId or use within a Custom Node component');
  }

  let resizeControlRef: HTMLDivElement;
  let resizer: XYResizerInstance | null = $state(null);

  let isLineVariant = $derived(variant === ResizeControlVariant.Line);

  let controlPosition = $derived.by(() => {
    let defaultPosition = (isLineVariant ? 'right' : 'bottom-right') as ControlPosition;
    return position ?? defaultPosition;
  });

  let positionClasses = $derived(controlPosition.split('-'));

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
          const changes: NodeChange[] = [];
          const horizontal = !resizeDirection || resizeDirection === 'horizontal';
          const vertical = !resizeDirection || resizeDirection === 'vertical';
          const node = store.nodeLookup.get(id);

          if (node && change.x !== undefined && change.y !== undefined) {
            changes.push(
              positionChange(id, {
                x: horizontal ? change.x : node.position.x,
                y: vertical ? change.y : node.position.y
              })
            );
          }

          if (change.width !== undefined && change.height !== undefined) {
            changes.push({
              id,
              type: 'dimensions',
              resizing: true,
              setAttributes: !resizeDirection
                ? true
                : resizeDirection === 'horizontal'
                  ? 'width'
                  : 'height',
              dimensions: {
                width: change.width,
                height: change.height
              }
            });
          }

          for (const childChange of childChanges) {
            changes.push(positionChange(childChange.id, childChange.position));
          }

          store.queueNodeChanges(changes);
        },
        onEnd: ({ width, height }) => {
          store.queueNodeChanges([
            {
              id,
              type: 'dimensions',
              resizing: false,
              dimensions: { width, height }
            }
          ]);
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
      resizeDirection,
      onResizeStart,
      onResize,
      onResizeEnd,
      shouldResize
    });
  });
</script>

<div
  class={['svelte-flow__resize-control', store.noDragClass, ...positionClasses, variant, className]}
  bind:this={resizeControlRef}
  style:border-color={isLineVariant ? color : undefined}
  style:background-color={isLineVariant ? undefined : color}
  style:scale={isLineVariant || !autoScale ? undefined : Math.max(1 / store.viewport.zoom, 1)}
  {...rest}
>
  {@render children?.()}
</div>
