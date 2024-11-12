<script lang="ts">
	import {
		Handle,
		Position,
		useHandleConnections,
		useNodesData,
		useSvelteFlow,
		type Node,
		type NodeProps
	} from '@xyflow/svelte';
	import { isTextNode, type MyNode } from './+page.svelte';

	let { id, data }: NodeProps<Node<{ text: string }>> = $props();

	const { updateNodeData } = useSvelteFlow();
	const connections = useHandleConnections({
		nodeId: id,
		type: 'target'
	});

	let nodeData = $derived(useNodesData<MyNode>($connections[0]?.source));
	let textNode = $derived(isTextNode($nodeData) ? $nodeData : null);

	$inspect(textNode?.data, data);

	$effect.pre(() => {
		const input = textNode?.data.text.toUpperCase() ?? '';
		updateNodeData(id, { text: input });
		console.log('updatedNodeData with', input);
	});
</script>

<div class="custom">
	<Handle type="target" position={Position.Left} isConnectable={$connections.length === 0} />
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
