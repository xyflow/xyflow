<script lang="ts">
	import { getRectOfNodes } from '@reactflow/utils';

  import { useStore } from '$lib/store';
  import Selection from '$lib/components/Selection/index.svelte';

  const { selectionRectModeStore, nodesStore, nodeOriginStore } = useStore();

  $: selectedNodes = $nodesStore.filter(n => n.selected);
  $: rect = getRectOfNodes(selectedNodes, $nodeOriginStore);

  // @todo: use zoom action for selection
</script> 

{#if selectedNodes}
  <Selection
    isVisible={$selectionRectModeStore === 'nodes'}
    width={rect.width}
    height={rect.height}
    x={rect.x}
    y={rect.y}
  />
{/if}
