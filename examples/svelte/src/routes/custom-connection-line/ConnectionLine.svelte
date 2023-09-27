<script lang="ts">
	import { useStore } from '@xyflow/svelte';

	const { connection } = useStore();
</script>

{#if $connection.path}
	<path d={$connection.path} fill="none" stroke={$connection.startHandle?.handleId} />
{/if}
