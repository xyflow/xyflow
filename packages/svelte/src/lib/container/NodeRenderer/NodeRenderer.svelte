<script lang="ts">
  import { onDestroy } from 'svelte';
  import { nodeHasDimensions } from '@xyflow/system';

  import { NodeWrapper } from '$lib/components/NodeWrapper';
  import { useStore } from '$lib/store';

  const {
    visibleNodes,
    nodesDraggable,
    nodesConnectable,
    elementsSelectable,
    updateNodeInternals,
    parentLookup
  } = useStore();

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

          updateNodeInternals(updates);
        });

  onDestroy(() => {
    resizeObserver?.disconnect();
  });
</script>

<div class="svelte-flow__nodes">
  {#each $visibleNodes as node (node.id)}
    <NodeWrapper
      {node}
      id={node.id}
      data={node.data}
      selected={!!node.selected}
      hidden={!!node.hidden}
      draggable={!!(node.draggable || ($nodesDraggable && typeof node.draggable === 'undefined'))}
      selectable={!!(
        node.selectable ||
        ($elementsSelectable && typeof node.selectable === 'undefined')
      )}
      connectable={!!(
        node.connectable ||
        ($nodesConnectable && typeof node.connectable === 'undefined')
      )}
      deletable={node.deletable ?? true}
      positionX={node.internals.positionAbsolute.x}
      positionY={node.internals.positionAbsolute.y}
      isParent={$parentLookup.has(node.id)}
      style={node.style}
      class={node.class}
      type={node.type ?? 'default'}
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
      parentId={node.parentId}
      {resizeObserver}
      on:nodeclick
      on:nodemouseenter
      on:nodemousemove
      on:nodemouseleave
      on:nodedrag
      on:nodedragstart
      on:nodedragstop
      on:nodecontextmenu
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
