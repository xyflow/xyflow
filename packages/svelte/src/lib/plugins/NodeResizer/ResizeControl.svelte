<script lang="ts">
  import { getContext, onMount } from 'svelte';
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
  import type { Node } from '$lib/types';

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

  const store = useStore();

  let id = $derived(
    typeof nodeId === 'string' ? nodeId : getContext<string>('svelteflow__node_id')
  );

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
          // eslint-disable-next-line svelte/prefer-svelte-reactivity
          const changes = new Map<string, Partial<Node>>();
          let position = change.x && change.y ? { x: change.x, y: change.y } : undefined;
          changes.set(id, { ...change, position });

          for (const childChange of childChanges) {
            changes.set(childChange.id, {
              position: childChange.position
            });
          }

          store.nodes = store.nodes.map((node) => {
            const change = changes.get(node.id);
            const horizontal = !resizeDirection || resizeDirection === 'horizontal';
            const vertical = !resizeDirection || resizeDirection === 'vertical';

            if (change) {
              return {
                ...node,
                position: {
                  x: horizontal ? (change.position?.x ?? node.position.x) : node.position.x,
                  y: vertical ? (change.position?.y ?? node.position.y) : node.position.y
                },
                width: horizontal ? (change.width ?? node.width) : node.width,
                height: vertical ? (change.height ?? node.height) : node.height
              };
            }
            return node;
          });
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
