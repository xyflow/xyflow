<script lang="ts">
	import {
		Handle,
		Position,
		useNodeConnections,
		useNodesData,
		useSvelteFlow,
		type NodeProps
	} from '@xyflow/svelte';
	import { isTextNode, type MyNode } from './+page.svelte';

	type $$Props = NodeProps;

	export let id: $$Props['id'];
	export let data: $$Props['data'];
	$$restProps;

	const { updateNodeData } = useSvelteFlow();
	const connections = useNodeConnections({
		nodeId: id,
		type: 'target'
	});

	$: nodeData = useNodesData<MyNode>($connections[0]?.source);
	$: textNode = isTextNode($nodeData) ? $nodeData : null;

	$: console.log(textNode?.data, data);

	$: {
		const input = textNode?.data.text.toUpperCase() ?? '';
		updateNodeData(id, { text: input });
		console.log('updatedNodeData with', input);
	}
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
