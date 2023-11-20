<script lang="ts">
	import { NodeToolbar, useNodes } from '@xyflow/svelte';

	const nodes = useNodes();

	$: selectedNodeIds = $nodes.filter((node) => node.selected).map((node) => node.id);
	$: isVisible = selectedNodeIds.length > 1;
</script>

<NodeToolbar nodeId={selectedNodeIds} {isVisible}>
	<button>Selection action</button>
</NodeToolbar>
