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
      x: node.positionAbsolute?.x ?? 0,
      y: node.positionAbsolute?.y ?? 0,
      width: (node.size?.width || node.width) ?? 0,
      height: (node.size?.height || node.height) ?? 0,
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
      positionAbsolute={node.positionAbsolute}
      positionOrigin={posOrigin}
      isParent={!!node[internalsSymbol]?.isParent}
      style={node.style}
      class={node.class}
      type={node.type}
      sourcePosition={node.sourcePosition}
      targetPosition={node.targetPosition}
      dragging={node.dragging}
      zIndex={node[internalsSymbol]?.z ?? 0}
      dragHandle={node.dragHandle}
      initialized={(!!node.width && !!node.height) || (!!node.size?.width && !!node.size?.height)}
      {resizeObserver}
      on:nodeclick
      on:nodemouseenter
      on:nodemousemove
      on:nodemouseleave
      on:connectstart
      on:connect
      on:connectend
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
