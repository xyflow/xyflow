<script lang="ts">
	import {
		Handle,
		Position,
		useHandleConnections,
		useNodesData,
		useUpdateNodeData,
		type NodeProps
	} from '@xyflow/svelte';

	type $$Props = NodeProps;

	export let id: $$Props['id'];

	const connections = useHandleConnections({
		nodeId: id,
		type: 'target'
	});

	const nodeData = useNodesData($connections.map((connection) => connection.source));
</script>

<div class="custom">
	<Handle type="target" position={Position.Left} />
	<div>incoming texts:</div>

	{#each $nodeData as data}
		<div>{data.text}</div>
	{/each}
</div>

<style>
	.custom {
		background-color: #eee;
		padding: 10px;
		border-radius: 10px;
	}
</style>
