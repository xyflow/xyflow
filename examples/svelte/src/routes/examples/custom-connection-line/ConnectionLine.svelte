<script lang="ts">
	import { getBezierPath, useConnection } from '@xyflow/svelte';

	const connection = useConnection();

	let path: string | null = $derived.by(() => {
		if ($connection.inProgress) {
			const { from, to, fromPosition, toPosition } = $connection;
			const pathParams = {
				sourceX: from.x,
				sourceY: from.y,
				sourcePosition: fromPosition,
				targetX: to.x,
				targetY: to.y,
				targetPosition: toPosition
			};
			const [path] = getBezierPath(pathParams);
			return path;
		}
		return null;
	});
</script>

{#if $connection.inProgress}
	<path d={path} fill="none" stroke={$connection.fromHandle.id} />
{/if}
