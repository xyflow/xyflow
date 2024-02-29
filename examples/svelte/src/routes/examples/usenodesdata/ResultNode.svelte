<script lang="ts">
	import {
		Handle,
		Position,
		useHandleConnections,
		useNodesData,
		type NodeProps
	} from '@xyflow/svelte';
	import { isTextNode, type MyNode } from './+page.svelte';

	type $$Props = NodeProps;

	export let id: $$Props['id'];

	const connections = useHandleConnections({
		nodeId: id,
		type: 'target'
	});

	$: nodeData = useNodesData<MyNode>($connections.map((connection) => connection.source));
	$: textNodes = $nodeData.filter(isTextNode);
</script>

<div class="custom">
	<Handle type="target" position={Position.Left} />
	<div>incoming texts:</div>

	{#each textNodes as textNode}
		<div>{textNode.data.text}</div>
	{/each}
</div>

<style>
	.custom {
		background-color: #eee;
		padding: 10px;
		border-radius: 10px;
	}
</style>
