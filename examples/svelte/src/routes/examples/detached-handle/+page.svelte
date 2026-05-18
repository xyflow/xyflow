<script lang="ts">
	import {
		SvelteFlow,
		Background,
		MiniMap,
		Position,
		type Node,
		type NodeTypes,
		type Edge
	} from '@xyflow/svelte';
	import CustomNode from './CustomNode.svelte';

	import '@xyflow/svelte/dist/style.css';

	const nodeTypes: NodeTypes = {
		custom: CustomNode
	};

	let nodes = $state.raw<Node[]>([
		{
			id: '1',
			type: 'custom',
			data: { label: 'node 1' },
			position: { x: 0, y: 0 },
			sourcePosition: Position.Right
		},
		{
			id: '2',
			type: 'custom',
			data: { label: 'node 2' },
			position: { x: 250, y: 250 }
		}
	]);

	let edges = $state.raw<Edge[]>([]);
</script>

<SvelteFlow bind:nodes bind:edges {nodeTypes} fitView>
	<Background />
	<MiniMap />
</SvelteFlow>
