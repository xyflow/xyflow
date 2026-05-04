<script lang="ts" generics="NodeType extends Node = Node, EdgeType extends Edge = Edge">
  import { getInternalNodesBounds, isNumeric, type Rect } from '@xyflow/system';

  import { Selection } from '$lib/components/Selection';
  import drag from '$lib/actions/drag';

  import type { NodeSelectionProps } from './types';
  import { arrowKeyDiffs, toPxString } from '$lib/utils';
  import type { Node, Edge } from '$lib/types';

  let {
    store = $bindable(),
    onnodedrag,
    onnodedragstart,
    onnodedragstop,
    onselectionclick,
    onselectioncontextmenu
  }: NodeSelectionProps<NodeType, EdgeType> = $props();

  let ref = $state<HTMLDivElement>();

  $effect(() => {
    if (!store.disableKeyboardA11y) {
      ref?.focus({
        preventScroll: true
      });
    }
  });

  let bounds: Rect | null = $derived.by(() => {
    if (store.selectionRectMode === 'nodes') {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      store.nodes;
      const nodeBounds = getInternalNodesBounds(store.nodeLookup, {
        filter: (node) => !!node.selected
      });
      if (nodeBounds.width > 0 && nodeBounds.height > 0) {
        return nodeBounds;
      }
    }
    return null;
  });

  function oncontextmenu(event: MouseEvent) {
    const selectedNodes = store.nodes.filter((n) => n.selected);
    onselectioncontextmenu?.({ nodes: selectedNodes, event });
  }

  function onclick(event: MouseEvent) {
    const selectedNodes = store.nodes.filter((n) => n.selected);
    onselectionclick?.({ nodes: selectedNodes, event });
  }

  function onkeydown(event: KeyboardEvent) {
    if (Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event.key)) {
      event.preventDefault();
      store.moveSelectedNodes(arrowKeyDiffs[event.key], event.shiftKey ? 4 : 1);
    }
  }
</script>

{#if store.selectionRectMode === 'nodes' && bounds && isNumeric(bounds.x) && isNumeric(bounds.y)}
  <div
    class={['svelte-flow__selection-wrapper', store.noPanClass]}
    style:width={toPxString(bounds.width)}
    style:height={toPxString(bounds.height)}
    style:transform="translate({bounds.x}px, {bounds.y}px)"
    use:drag={{
      disabled: false,
      store,
      onDrag: (event, _, __, nodes) => {
        onnodedrag?.({ event, targetNode: null, nodes: nodes as NodeType[] });
      },
      onDragStart: (event, _, __, nodes) => {
        onnodedragstart?.({ event, targetNode: null, nodes: nodes as NodeType[] });
      },
      onDragStop: (event, _, __, nodes) => {
        onnodedragstop?.({ event, targetNode: null, nodes: nodes as NodeType[] });
      }
    }}
    {oncontextmenu}
    {onclick}
    role={store.disableKeyboardA11y ? undefined : 'button'}
    tabIndex={store.disableKeyboardA11y ? undefined : -1}
    onkeydown={store.disableKeyboardA11y ? undefined : onkeydown}
    bind:this={ref}
  >
    <Selection width="100%" height="100%" x={0} y={0} />
  </div>
{/if}

<style>
  .svelte-flow__selection-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2000;
    pointer-events: all;
  }

  .svelte-flow__selection-wrapper:focus,
  .svelte-flow__selection-wrapper:focus-visible {
    outline: none;
  }
</style>
