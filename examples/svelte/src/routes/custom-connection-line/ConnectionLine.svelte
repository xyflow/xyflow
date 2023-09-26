<script lang="ts">
	import { useStore } from '@xyflow/svelte';

	const { connectionPath, connection } = useStore();
</script>

{#if $connectionPath}
	<g class={$connection.connectionStatus}>
		<path d={$connectionPath} fill="none" stroke="red" />
	</g>
{/if}
