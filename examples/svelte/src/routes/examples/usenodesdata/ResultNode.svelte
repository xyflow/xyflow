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

	interface Props {
		id: $$Props['id'];
		[key: string]: any
	}

	let { id, ...rest }: Props = $props();
	rest;

	const connections = useHandleConnections({
		nodeId: id,
		type: 'target'
	});

	let nodeData = $derived(useNodesData<MyNode>($connections.map((connection) => connection.source)));
	let textNodes = $derived($nodeData.filter(isTextNode));
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
