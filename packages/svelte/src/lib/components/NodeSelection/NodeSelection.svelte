<script lang="ts">
  import { getNodesBounds } from '@xyflow/system';

  import { useStore } from '$lib/store';
  import { Selection } from '$lib/components/Selection';
  import drag from '$lib/actions/drag';

  const store = useStore();
  const { selectionRectMode, nodes } = store;

  $: selectedNodes = $nodes.filter((n) => n.selected);
  $: bounds = getNodesBounds(selectedNodes);
</script>

{#if selectedNodes && $selectionRectMode === 'nodes'}
  <div
    class="selection-wrapper nopan"
    style="width: {bounds.width}px; height: {bounds.height}px; transform: translate({bounds.x}px, {bounds.y}px)"
    use:drag={{ disabled: false, store }}
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
