<script lang="ts">
	import {
		Handle,
		Position,
		useHandleConnections,
		useNodesData,
		useSvelteFlow,
		type NodeProps
	} from '@xyflow/svelte';
	import { isTextNode, type MyNode } from './+page.svelte';

	type $$Props = NodeProps;

	export let id: $$Props['id'];

	const { updateNodeData } = useSvelteFlow();
	const connections = useHandleConnections({
		nodeId: id,
		type: 'target'
	});

	$: nodeData = useNodesData<MyNode>($connections[0]?.source);
	$: textNode = isTextNode($nodeData) ? $nodeData : null;

	$: {
		updateNodeData(id, { text: textNode?.data.text.toUpperCase() || '' });
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
