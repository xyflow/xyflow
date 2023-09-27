<script lang="ts">
	import { useStore } from '@xyflow/svelte';

	const { connection } = useStore();
</script>

{#if $connection.path}
	<g class={$connection.status}>
		<path d={$connection.path} fill="none" stroke={$connection.startHandle?.handleId} />
	</g>
{/if}
