<script lang="ts">
  import { getRectOfNodes } from '@reactflow/utils';

  import { useStore } from '$lib/store';
  import { Selection } from '$lib/components/Selection';
  import drag from '$lib/actions/drag';

  const { selectionRectMode, nodes, transform, updateNodePositions } = useStore();

  $: selectedNodes = $nodes.filter((n) => n.selected);
  $: rect = getRectOfNodes(selectedNodes);
</script>

{#if selectedNodes && $selectionRectMode === 'nodes'}
  <div
    class="selection-wrapper nopan"
    style={`width: ${rect.width}px; height: ${rect.height}px; transform: translate(${rect.x}px, ${rect.y}px)`}
    use:drag={{ nodes, transform, updateNodePositions }}
  />
  <Selection
    isVisible={$selectionRectMode === 'nodes'}
    width={rect.width}
    height={rect.height}
    x={rect.x}
    y={rect.y}
  />
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
