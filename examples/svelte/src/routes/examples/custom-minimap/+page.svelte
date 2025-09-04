<script lang="ts">
	import {
		SvelteFlow,
		Background,
		Controls,
		MiniMap,
		type Node,
		type Edge,
	} from '@xyflow/svelte';
	
	import '@xyflow/svelte/dist/style.css';
	import CustomMiniMapNode from './CustomMiniMapNode.svelte';

	let nodes = $state.raw<Node[]>([]);
	let edges = $state.raw<Edge[]>([]);

	function addRandomNode() {
		const nodeId = (nodes.length + 1).toString();
		const newNode: Node = {
			id: nodeId,
			data: { label: `Node: ${nodeId}` },
			position: {
				x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
				y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600),
			},
			type: 'default'
		};
		nodes = [...nodes, newNode];
	}
</script>

<SvelteFlow
	bind:nodes
	bind:edges
	onlyRenderVisibleElements={true}
>
	<Controls />
	<Background />
	<MiniMap nodeComponent={CustomMiniMapNode} />

	<button 
		type="button" 
		onclick={addRandomNode}
		style="position: absolute; left: 10px; top: 10px; z-index: 4;"
	>
		add node
	</button>
</SvelteFlow>
