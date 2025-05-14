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
	import { isTextNode, type MyNode } from './+page.svelte';

	let { id }: NodeProps<Node<{ text: string }>> = $props();

	const { updateNodeData } = useSvelteFlow();
	const connections = useNodeConnections({
		id: id,
		handleType: 'target'
	});

	let nodeData = $derived(useNodesData<MyNode>(connections.current[0]?.source));
	let textNodeData = $derived(isTextNode(nodeData.current) ? nodeData.current.data.text : null);

	$effect.pre(() => {
		const input = textNodeData?.toUpperCase() ?? '';
		updateNodeData(id, { text: input });
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
