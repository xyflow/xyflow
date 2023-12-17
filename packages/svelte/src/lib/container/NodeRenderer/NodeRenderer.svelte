<script lang="ts">
  import { onDestroy } from 'svelte';
  import { internalsSymbol, getPositionWithOrigin } from '@xyflow/system';

  import { NodeWrapper } from '$lib/components/NodeWrapper';
  import { useStore } from '$lib/store';

  const {
    visibleNodes,
    nodesDraggable,
    nodesConnectable,
    elementsSelectable,
    updateNodeDimensions
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
              forceUpdate: true
            });
          });

          updateNodeDimensions(updates);
        });

  onDestroy(() => {
    resizeObserver?.disconnect();
  });
</script>

<div class="svelte-flow__nodes">
  {#each $visibleNodes as node (node.id)}
    {@const posOrigin = getPositionWithOrigin({
      x: node.computed?.positionAbsolute?.x ?? 0,
      y: node.computed?.positionAbsolute?.y ?? 0,
      width: node.computed?.width ?? node.width ?? 0,
      height: node.computed?.height ?? node.height ?? 0,
      origin: node.origin
    })}
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
      positionX={node.computed?.positionAbsolute?.x ?? 0}
      positionY={node.computed?.positionAbsolute?.y ?? 0}
      positionOriginX={posOrigin.x ?? 0}
      positionOriginY={posOrigin.y ?? 0}
      isParent={!!node[internalsSymbol]?.isParent}
      style={node.style}
      class={node.class}
      type={node.type ?? 'default'}
      sourcePosition={node.sourcePosition}
      targetPosition={node.targetPosition}
      dragging={node.dragging}
      zIndex={node[internalsSymbol]?.z ?? 0}
      dragHandle={node.dragHandle}
      width={node.width ?? undefined}
      height={node.height ?? undefined}
      initialized={(!!node.computed?.width && !!node.computed?.height) ||
        (!!node.width && !!node.height)}
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
