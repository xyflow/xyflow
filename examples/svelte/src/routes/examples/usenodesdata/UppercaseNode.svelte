<script lang="ts">
	import {
		Handle,
		Position,
		useNodeConnections,
		useNodesData,
		useSvelteFlow,
		type Node,
		type NodeProps
	} from '@xyflow/svelte';
	import { type MyNode } from './+page.svelte';

	let { id }: NodeProps<Node<{ text: string }>> = $props();

	const { updateNodeData } = useSvelteFlow();
	const connections = useNodeConnections({
		handleType: 'target'
	});

	let nodesData = $derived(useNodesData<MyNode>(connections.current[0]?.source));

	$effect.pre(() => {
		const text =
			nodesData.current?.type === 'text' ? nodesData.current?.data.text.toUpperCase() : undefined;
		updateNodeData(id, { text });
	});
</script>

<div class="custom">
	<Handle type="target" position={Position.Left} isConnectable={connections.current.length === 0} />
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
