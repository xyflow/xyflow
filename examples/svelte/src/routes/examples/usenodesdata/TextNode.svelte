<script lang="ts">
	import { Handle, Position, type NodeProps, useSetNodeData } from '@xyflow/svelte';

	type $$Props = NodeProps;

	export let id: $$Props['id'];
	export let data: $$Props['data'];

	const setNodeData = useSetNodeData();
</script>

<div class="custom">
	<div>node {id}</div>
	<div>
		<input
			value={data.text}
			on:input={(evt) => setNodeData(id, { text: evt.currentTarget.value })}
		/>
	</div>
	<Handle type="source" position={Position.Right} />
</div>

<style>
	.custom {
		background-color: #eee;
		padding: 10px;
		border-radius: 10px;
	}
</style>
