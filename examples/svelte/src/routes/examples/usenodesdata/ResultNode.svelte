<script lang="ts">
	import {
		Handle,
		Position,
		useNodeConnections,
		useNodesData,
		type NodeProps
	} from '@xyflow/svelte';
	import { isTextNode, type MyNode } from './+page.svelte';

	let { id }: NodeProps = $props();

	const connections = useNodeConnections(() => ({
		id: id,
		handleType: 'target'
	}));

	useNodeConnections(() => ({
		onConnect: (connection) => {
			console.log('Connection made:', connection);
		},
		onDisconnect: (connection) => {
			console.log('Connection disconnected:', connection);
		}
	}));

	const nodeData = useNodesData<MyNode>(() => ({
		nodeIds: connections.current.map((connection) => connection.source)
	}));
	let textNodes = $derived(nodeData.current.filter(isTextNode));
</script>

<div class="custom">
	<Handle type="target" position={Position.Left} />
	<div>incoming texts:</div>

	{#each textNodes as textNode (textNode.id)}
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
