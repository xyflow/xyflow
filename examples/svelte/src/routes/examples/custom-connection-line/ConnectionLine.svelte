<script lang="ts">
	import { getBezierPath, useConnection } from '@xyflow/svelte';

	let connection = useConnection();

	let path = $derived.by(() => {
		if (connection.sourceX === null) return null;
		const [path] = getBezierPath({
			sourceX: connection.sourceX,
			sourceY: connection.sourceY,
			sourcePosition: connection.sourcePosition,
			targetX: connection.targetX,
			targetY: connection.targetY,
			targetPosition: connection.targetPosition
		});
		return path;
	});
</script>

{#if path}
	<path d={path} fill="none" stroke={connection.startHandle?.handleId} />
{/if}
