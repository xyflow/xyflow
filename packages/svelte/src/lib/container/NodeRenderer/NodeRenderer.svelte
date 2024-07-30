<script lang="ts">
  import { onDestroy } from 'svelte';
  import { useStore } from '$lib/store';
  import type { NodeEvents } from '$lib/types/events';
  import type { Node } from '$lib/types';
  import NodeWrapper from '$lib/components/NodeWrapper/NodeWrapper.svelte';
  import { nodeHasDimensions } from '@xyflow/system';
  import type { Writable } from 'svelte/store';

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
  }: NodeEvents & { nodes: Writable<Node[]> } = $props();

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
  {#each $nodes as userNode (userNode.id)}
    {@const internalNode = store.nodeLookup.get(userNode.id)!}
    <NodeWrapper
      node={internalNode}
      id={internalNode.id}
      data={internalNode.data}
      hidden={internalNode.hidden}
      selected={internalNode.selected}
      draggable={!!(
        internalNode.draggable ||
        (store.nodesDraggable && typeof internalNode.draggable === 'undefined')
      )}
      selectable={!!(
        internalNode.selectable ||
        (store.elementsSelectable && typeof internalNode.selectable === 'undefined')
      )}
      connectable={!!(
        internalNode.connectable ||
        (store.nodesConnectable && typeof internalNode.connectable === 'undefined')
      )}
      positionX={internalNode.internals.positionAbsolute.x}
      positionY={internalNode.internals.positionAbsolute.y}
      positionOriginX={internalNode.internals.positionAbsolute.x}
      positionOriginY={internalNode.internals.positionAbsolute.y}
      isParent={store.parentLookup.has(internalNode.id)}
      style={internalNode.style}
      class={internalNode.class}
      type={internalNode.type}
      sourcePosition={internalNode.sourcePosition}
      targetPosition={internalNode.targetPosition}
      dragging={internalNode.dragging}
      zIndex={internalNode.internals.z}
      dragHandle={internalNode.dragHandle}
      initialized={nodeHasDimensions(internalNode)}
      width={internalNode.width}
      height={internalNode.height}
      initialWidth={internalNode.initialWidth}
      initialHeight={internalNode.initialHeight}
      measuredWidth={internalNode.measured?.width}
      measuredHeight={internalNode.measured?.height}
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
