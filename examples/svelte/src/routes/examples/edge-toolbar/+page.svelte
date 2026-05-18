<script lang="ts">
	import { Background, Position, SvelteFlow, type Edge, type Node } from '@xyflow/svelte';

	import '@xyflow/svelte/dist/style.css';

	import CustomEdge from './CustomEdge.svelte';

	const edgeTypes = {
		custom: CustomEdge
	};

	const initialNodes: Node[] = [
		{
			id: '1',
			data: { label: 'Node 1', toolbarPosition: Position.Top },
			position: { x: 0, y: 0 },
			class: 'svelte-flow__node-default'
		},
		{
			id: '2',
			data: { label: 'Node 2', toolbarPosition: Position.Top },
			position: { x: 100, y: 150 },
			class: 'svelte-flow__node-default'
		},
		{
			id: '3',
			data: { label: 'Node 3', toolbarPosition: Position.Top },
			position: { x: 200, y: 0 },
			class: 'svelte-flow__node-default'
		}
	];

	const initialEdges: Edge[] = [
		{
			id: 'e1-2',
			source: '1',
			target: '2',
			type: 'custom'
		},
		{
			id: 'e3-2',
			source: '3',
			target: '2',
			type: 'custom'
		},
		{
			id: 'e1-3',
			source: '1',
			target: '3',
			type: 'custom'
		}
	];

	let nodes = $state.raw<Node[]>(initialNodes);
	let edges = $state.raw<Edge[]>(initialEdges);
</script>

<SvelteFlow bind:nodes bind:edges {edgeTypes} fitView>
	<Background />
</SvelteFlow>
