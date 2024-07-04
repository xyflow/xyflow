<script lang="ts">
  import { onDestroy } from 'svelte';
  import { useStore } from '$lib/store';
  import type { NodeEvents } from '$lib/types/events';
  import type { Node } from '$lib/types';
  import NodeWrapper from '$lib/components/NodeWrapper/NodeWrapper.svelte';
  import { nodeHasDimensions } from '@xyflow/system';

  let {
    nodes,
    onnodeclick,
    onnodemouseenter,
    onnodemousemove,
    onnodemouseleave,
    onnodedrag,
    onnodedragstart,
    onnodedragstop,
    onnodecontextmenu
  }: NodeEvents & { nodes: readonly Node[] } = $props();

  const store = useStore();

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
              force: true
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
  {#each nodes as userNode (userNode.id)}
    {@const internalNode = store.nodeLookup.get(userNode.id)!}
    <NodeWrapper
      node={internalNode}
      id={userNode.id}
      data={userNode.data}
      hidden={userNode.hidden}
      selected={userNode.selected}
      draggable={!!(
        userNode.draggable ||
        (store.nodesDraggable && typeof userNode.draggable === 'undefined')
      )}
      selectable={!!(
        userNode.selectable ||
        (store.elementsSelectable && typeof userNode.selectable === 'undefined')
      )}
      connectable={!!(
        userNode.connectable ||
        (store.nodesConnectable && typeof userNode.connectable === 'undefined')
      )}
      positionX={internalNode.internals.positionAbsolute.x}
      positionY={internalNode.internals.positionAbsolute.y}
      positionOriginX={internalNode.internals.positionAbsolute.x}
      positionOriginY={internalNode.internals.positionAbsolute.y}
      isParent={store.parentLookup.has(userNode.id)}
      style={userNode.style}
      class={userNode.class}
      type={userNode.type}
      sourcePosition={userNode.sourcePosition}
      targetPosition={userNode.targetPosition}
      dragging={userNode.dragging}
      zIndex={internalNode.internals.z}
      dragHandle={userNode.dragHandle}
      initialized={nodeHasDimensions(userNode)}
      width={userNode.width}
      height={userNode.height}
      initialWidth={userNode.initialWidth}
      initialHeight={userNode.initialHeight}
      measuredWidth={userNode.measured?.width}
      measuredHeight={userNode.measured?.height}
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
