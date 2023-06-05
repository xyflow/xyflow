<script lang="ts">
  import { onDestroy } from 'svelte';
  import { internalsSymbol, getPositionWithOrigin } from '@xyflow/system';

  import { NodeWrapper } from '$lib/components/NodeWrapper';
  import { useStore } from '$lib/store';

  const { nodes, nodesDraggable, nodesConnectable, elementsSelectable, updateNodeDimensions } = useStore();

  const resizeObserver: ResizeObserver | null =
    typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver((entries: ResizeObserverEntry[]) => {
          const updates = entries.map((entry: ResizeObserverEntry) => ({
            id: entry.target.getAttribute('data-id') as string,
            nodeElement: entry.target as HTMLDivElement,
            forceUpdate: true
          }));
          updateNodeDimensions(updates);
        });

  onDestroy(() => {
    resizeObserver?.disconnect();
  });
</script>

<div class="svelte-flow__nodes">
  {#each $nodes as node (node.id)}
    {@const posOrigin = getPositionWithOrigin({
      x: node.positionAbsolute?.x ?? 0,
      y: node.positionAbsolute?.y ?? 0,
      width: node.width ?? 0,
      height: node.height ?? 0,
      origin: node.origin
    })}
    <NodeWrapper
      id={node.id}
      data={node.data}
      selected={node.selected}
      draggable={!!(node.draggable || ($nodesDraggable && typeof node.draggable === 'undefined'))}
      selectable={!!(node.selectable || ($elementsSelectable && typeof node.selectable === 'undefined'))}
      connectable={!!(node.connectable || ($nodesConnectable && typeof node.connectable === 'undefined'))}
      positionAbsolute={node.positionAbsolute}
      positionOrigin={posOrigin}
      isParent={!!node[internalsSymbol]?.isParent}
      width={node.width}
      height={node.height}
      style={node.style}
      class={node.class}
      type={node.type}
      sourcePosition={node.sourcePosition}
      targetPosition={node.targetPosition}
      dragging={node.dragging}
      {resizeObserver}
      on:node:click
      on:node:mouseenter
      on:node:mousemove
      on:node:mouseleave
      on:connect:start
      on:connect
      on:connect:end
    />
  {/each}
</div>

<style>
  .svelte-flow__nodes {
    width: 100%;
    height: 100%;
    pointer-events: none;
    transform-origin: 0 0;
  }
</style>
