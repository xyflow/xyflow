<script lang="ts">
  import { getNodesBounds } from '@xyflow/system';

  import drag from '$lib/actions/drag';
  import { useStore } from '$lib/store';
  import { Selection } from '$lib/components/Selection';

  import type { NodeSelectionProps } from './types';

  let {
    onnodedrag,
    onnodedragstart,
    onnodedragstop,
    onselectionclick,
    onselectioncontextmenu
  }: NodeSelectionProps = $props();

  const store = useStore();

  let selectedNodes = $derived(Array.from(store.nodeLookup.values()).filter((n) => n.selected));
  let bounds = $derived(getNodesBounds(selectedNodes));

  function oncontextmenu(event: MouseEvent | TouchEvent) {
    onselectioncontextmenu?.({ nodes: selectedNodes, event });
  }

  function onclick(event: MouseEvent | TouchEvent) {
    onselectionclick?.({ nodes: selectedNodes, event });
  }
</script>

{#if selectedNodes && store.selectionRectMode === 'nodes'}
  <div
    class="selection-wrapper nopan"
    style="width: {bounds.width}px; height: {bounds.height}px; transform: translate({bounds.x}px, {bounds.y}px)"
    use:drag={{
      disabled: false,
      store,
      onDrag: (event, _, __, nodes) => {
        onnodedrag?.({ event, targetNode: null, nodes });
      },
      onDragStart: (event, _, __, nodes) => {
        onnodedragstart?.({ event, targetNode: null, nodes });
      },
      onDragStop: (event, _, __, nodes) => {
        onnodedragstop?.({ event, targetNode: null, nodes });
      }
    }}
    {oncontextmenu}
    {onclick}
    role="button"
    tabindex="-1"
    onkeyup={() => {}}
  >
    <Selection width="100%" height="100%" x={0} y={0} />
  </div>
{/if}

<style>
  .selection-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 7;
    pointer-events: all;
  }
</style>
