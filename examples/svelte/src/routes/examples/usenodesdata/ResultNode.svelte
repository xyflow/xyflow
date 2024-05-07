<script lang="ts">
	import { Handle, Position, useHandleConnections, type NodeProps } from '@xyflow/svelte';
	import { isTextNode } from './+page.svelte';

	let { id }: NodeProps = $props();

	let connections = useHandleConnections({
		nodeId: id,
		type: 'target'
	});

	let nodes = $derived(connections.value.map((connection) => connection.sourceNode));
	let textNodes = $derived(nodes ? nodes.filter(isTextNode) : []);
</script>

<div class="custom">
	<Handle type="target" position={Position.Left} />
	<div>incoming texts:</div>

	{#each textNodes as textNode}
		<div>{textNode?.data.text}</div>
	{/each}
</div>

<style>
	.custom {
		background-color: #eee;
		padding: 10px;
		border-radius: 10px;
	}
</style>
