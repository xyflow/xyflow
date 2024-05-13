<script lang="ts">
	import { Handle, Position, type NodeProps, useUpdateNodeInternals } from '@xyflow/svelte';

	let { id }: NodeProps = $props();

	const updateNodeInternals = useUpdateNodeInternals();

	let handleCount = $state(0);
	let handles = $state([{ id: `${Number.MAX_SAFE_INTEGER - handleCount}`, i: handleCount }]);

	const onClick = () => {
		handleCount += 1;
		handles.push({ id: `${Number.MAX_SAFE_INTEGER - handleCount}`, i: handleCount });
		updateNodeInternals(id);
	};
</script>

<Handle type="target" position={Position.Top} />
<button onclick={onClick}>add handle</button>

{#each handles.toReversed() as handle (handle.id)}
	<Handle
		type="source"
		position={Position.Bottom}
		id={handle.id}
		style={`left: ${handle.i * 10}px;`}
	/>
{/each}
