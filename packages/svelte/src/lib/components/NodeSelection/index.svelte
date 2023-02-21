<script lang="ts">
	import { getRectOfNodes } from '@reactflow/utils';

  import { useStore } from '$lib/store';
  import Selection from '$lib/components/Selection/index.svelte';
  import drag  from '$lib/actions/drag'

  const { selectionRectModeStore, nodesStore, nodeOriginStore, transformStore, updateNodePositions } = useStore();

  $: selectedNodes = $nodesStore.filter(n => n.selected);
  $: rect = getRectOfNodes(selectedNodes, $nodeOriginStore);
</script> 

{#if selectedNodes}
  <div
    class="selection-wrapper nopan"
    style={`width: ${rect.width}px; height: ${rect.height}px; transform: translate(${rect.x}px, ${rect.y}px)`}
    use:drag={{ nodesStore, transformStore, updateNodePositions }}
  />
  <Selection
    isVisible={$selectionRectModeStore === 'nodes'}
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