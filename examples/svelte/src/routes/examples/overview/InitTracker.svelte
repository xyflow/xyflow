<script lang="ts">
	import { useNodesInitialized, useInitialized } from '@xyflow/svelte';

	const nodesInitialized = useNodesInitialized();
	const initialized = useInitialized();

	$: {
		if (nodesInitialized) {
			console.log('nodes initialized');
		}
	}

	$: {
		if (initialized) {
			console.log('initialized');
		}
	}
</script>
