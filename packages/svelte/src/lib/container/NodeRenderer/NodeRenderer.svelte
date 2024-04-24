<script lang="ts">
  import { onDestroy } from 'svelte';
  import { getPositionWithOrigin, getNodeDimensions, nodeHasDimensions } from '@xyflow/system';

  import { NodeWrapper } from '$lib/components/NodeWrapper';
  import { useStore } from '$lib/store';
  import type { NodeEvents } from '$lib/types/events';

  let {
    onnodeclick,
    onnodemouseenter,
    onnodemousemove,
    onnodemouseleave,
    onnodedrag,
    onnodedragstart,
    onnodedragstop,
    onnodecontextmenu
  }: NodeEvents = $props();

  const store = useStore();

  const { nodes } = store;

  const resizeObserver: ResizeObserver | null =
    typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver((entries: ResizeObserverEntry[]) => {
          const updates = new Map();

          entries.forEach((entry: ResizeObserverEntry) => {
            const id = entry.target.getAttribute('data-id') as string;

            updates.set(id, {
              id,
              nodeElement: entry.target as HTMLDivElement,
              forceUpdate: true
            });
          });

          store.updateNodeInternals(updates);
        });

  onDestroy(() => {
    resizeObserver?.disconnect();
  });
</script>

<!-- TODO: render visibleNodes -->
<div class="svelte-flow__nodes">
  {#each $nodes as user_node (user_node.id)}
    {@const node = store.nodeLookup.get(user_node.id)!}
    {@const posOrigin = getPositionWithOrigin({
      x: node.internals.positionAbsolute.x,
      y: node.internals.positionAbsolute.y,
      ...getNodeDimensions(node),
      origin: node.origin
    })}
    <NodeWrapper
      {node}
      id={node.id}
      data={node.data}
      selected={!!node.selected}
      hidden={!!node.hidden}
      draggable={!!(
        node.draggable ||
        (store.nodesDraggable && typeof node.draggable === 'undefined')
      )}
      selectable={!!(
        node.selectable ||
        (store.elementsSelectable && typeof node.selectable === 'undefined')
      )}
      connectable={!!(
        node.connectable ||
        (store.nodesConnectable && typeof node.connectable === 'undefined')
      )}
      positionX={node.internals.positionAbsolute.x}
      positionY={node.internals.positionAbsolute.y}
      positionOriginX={posOrigin.x ?? 0}
      positionOriginY={posOrigin.y ?? 0}
      isParent={store.parentLookup.has(node.id)}
      style={node.style}
      class={node.class}
      type={node.type}
      sourcePosition={node.sourcePosition}
      targetPosition={node.targetPosition}
      dragging={node.dragging}
      zIndex={node.internals.z ?? 0}
      dragHandle={node.dragHandle}
      initialized={nodeHasDimensions(node)}
      width={node.width}
      height={node.height}
      initialWidth={node.initialWidth}
      initialHeight={node.initialHeight}
      measuredWidth={node.measured.width}
      measuredHeight={node.measured.height}
      {resizeObserver}
      {onnodeclick}
      {onnodemouseenter}
      {onnodemousemove}
      {onnodemouseleave}
      {onnodedrag}
      {onnodedragstart}
      {onnodedragstop}
      {onnodecontextmenu}
    />
  {/each}
</div>

<style>
  .svelte-flow__nodes {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
</style>
