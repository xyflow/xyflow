<script lang="ts">
	import { useNodesInitialized, useViewportInitialized } from '@xyflow/svelte';

	const nodesInitialized = useNodesInitialized();
	const viewportInitialized = useViewportInitialized();

	$effect(() => {
		if (viewportInitialized.current) {
			console.log('viewportInitialized');
		}
	});

	$effect(() => {
		if (nodesInitialized.current) {
			console.log('nodes initialized');
		}
	});
</script>
