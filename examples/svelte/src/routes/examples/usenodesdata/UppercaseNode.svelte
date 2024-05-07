<script lang="ts">
	import {
		Handle,
		Position,
		useHandleConnections,
		useSvelteFlow,
		type NodeProps
	} from '@xyflow/svelte';
	import { isTextNode } from './+page.svelte';

	let { id }: NodeProps = $props();

	const { updateNodeData } = useSvelteFlow();

	const connections = useHandleConnections({
		nodeId: id,
		type: 'target'
	});

	let connectedNode = $derived(connections.value[0]?.sourceNode);
	let textNode = $derived(isTextNode(connectedNode) ? connectedNode : null);

	$effect.pre(() => {
		const input = textNode?.data.text.toUpperCase() ?? '';
		updateNodeData(id, { text: input });
	});
</script>

<div class="custom">
	<Handle type="target" position={Position.Left} isConnectable={connections.value.length === 0} />
	<div>uppercase transform</div>
	<Handle type="source" position={Position.Right} />
</div>

<style>
	.custom {
		background-color: #eee;
		padding: 10px;
		border-radius: 10px;
	}
</style>
