<script lang="ts">
	import { useConnection } from '@xyflow/svelte';

	const connection = useConnection();
</script>

{#if $connection.path}
	<path d={$connection.path} fill="none" stroke={$connection.startHandle?.handleId} />
{/if}
