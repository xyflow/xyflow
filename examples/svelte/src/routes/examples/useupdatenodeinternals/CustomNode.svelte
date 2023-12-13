<script lang="ts">
	import { Handle, Position, type NodeProps, useUpdateNodeInternals } from '@xyflow/svelte';

	type $$Props = NodeProps;

	export let id: $$Props['id'];

	const updateNodeInternals = useUpdateNodeInternals();

	$: handleCount = 1;

	const onClick = () => {
		handleCount += 1;
		updateNodeInternals(id);
	};
</script>

<Handle type="target" position={Position.Top} />
<button on:click={onClick}>add handle</button>

{#each Array.from({ length: handleCount }) as handle, i}
	<Handle type="source" position={Position.Bottom} id={`${i}`} style={`left: ${i * 10}px;`} />
{/each}
