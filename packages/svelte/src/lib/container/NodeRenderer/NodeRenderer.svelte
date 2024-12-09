<script lang="ts">
  import { onDestroy } from 'svelte';
  import { nodeHasDimensions } from '@xyflow/system';

  import type { Node, NodeEvents } from '$lib/types';
  import { NodeWrapper } from '$lib/components/NodeWrapper';
  import type { SvelteFlowStore } from '$lib/store/types';

  let {
    store,
    nodeClickDistance,
    onnodeclick,
    onnodecontextmenu,
    onnodemouseenter,
    onnodemousemove,
    onnodemouseleave,
    onnodedrag,
    onnodedragstart,
    onnodedragstop
  }: { store: SvelteFlowStore; nodeClickDistance?: number } & NodeEvents = $props();

  // const { nodes } = store;

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

  function give(node: Node) {
    const internalNode = store.nodeLookup.get(node.id);
    // console.log('this reruns most definitely', internalNode);
    console.log(internalNode?.position);
    return internalNode;
  }

  // $inspect(store.nodes).with(console.trace);
</script>

<div class="svelte-flow__nodes">
  {#each store.nodes as node (node.id)}
    {@const internalNode = store.nodeLookup.get(node.id)}
    <NodeWrapper
      {store}
      node={internalNode!}
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
      deletable={node.deletable ?? true}
      positionX={internalNode!.internals.positionAbsolute.x}
      positionY={internalNode!.internals.positionAbsolute.y}
      isParent={store.parentLookup.has(node.id)}
      style={node.style}
      class={node.class}
      type={node.type ?? 'default'}
      sourcePosition={node.sourcePosition}
      targetPosition={node.targetPosition}
      dragging={node.dragging}
      zIndex={internalNode!.internals.z ?? 0}
      dragHandle={node.dragHandle}
      initialized={nodeHasDimensions(node)}
      width={node.width}
      height={node.height}
      initialWidth={node.initialWidth}
      initialHeight={node.initialHeight}
      measuredWidth={node.measured?.width ?? 0}
      measuredHeight={node.measured?.height ?? 0}
      parentId={node.parentId}
      {resizeObserver}
      {nodeClickDistance}
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
