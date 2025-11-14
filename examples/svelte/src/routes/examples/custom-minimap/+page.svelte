<script lang="ts">
	import {
		SvelteFlow,
		Background,
		Controls,
		MiniMap,
		Panel,
		type Node,
		type Edge
	} from '@xyflow/svelte';

	import '@xyflow/svelte/dist/style.css';
	import CustomMiniMapNode from './CustomMiniMapNode.svelte';

	let nodes = $state.raw<Node[]>([]);
	let edges = $state.raw<Edge[]>([]);
	let hideAllNodes = $state(false);

	function addRandomNode() {
		const nodeId = (nodes.length + 1).toString();
		const newNode: Node = {
			id: nodeId,
			data: { label: `Node: ${nodeId}` },
			position: {
				x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800),
				y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600)
			},
			type: 'default',
			hidden: hideAllNodes
		};
		nodes = [...nodes, newNode];
	}

	function toggleHideAllNodes() {
		hideAllNodes = !hideAllNodes;
		nodes = nodes.map((node) => ({
			...node,
			hidden: hideAllNodes
		}));
	}
</script>

<SvelteFlow bind:nodes bind:edges onlyRenderVisibleElements={true}>
	<Controls />
	<Background />
	<MiniMap nodeComponent={CustomMiniMapNode} />

	<Panel position="top-left">
		<button type="button" onclick={addRandomNode}> add node </button>

		<button type="button" onclick={toggleHideAllNodes}>
			{hideAllNodes ? 'show all nodes' : 'hide all nodes'}
		</button>
	</Panel>
</SvelteFlow>
