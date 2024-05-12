<script lang="ts">
	import { SvelteFlow, Background, Controls, useSvelteFlow } from '@xyflow/svelte';
	import type { Edge, Node, NodeTargetEventWithPointer } from '@xyflow/svelte';

	import '@xyflow/svelte/dist/style.css';

	let nodes = $state<Node[]>([
		{
			id: '1',
			data: { label: 'Node 1' },
			position: { x: 0, y: 0 },
			style: 'width: 200px; height: 100px;'
		},
		{
			id: '2',
			data: { label: 'Node 2' },
			position: { x: 0, y: 150 }
		},
		{
			id: '3',
			data: { label: 'Node 3' },
			position: { x: 250, y: 0 }
		},
		{
			id: '4',
			data: { label: 'Node' },
			position: { x: 350, y: 150 },
			style: 'width: 50px; height: 50px;'
		}
	]);
	let edges = $state<Edge[]>([]);

	const { getIntersectingNodes } = useSvelteFlow();

	const onNodeDrag: NodeTargetEventWithPointer = ({ targetNode }) => {
		if (targetNode) {
			const intersections = getIntersectingNodes(targetNode).map((n) => n.id);
			nodes.forEach((n) => {
				n.class = intersections.includes(n.id) ? 'highlight' : '';
			});
		}
	};
</script>

<div style="height:100vh;" class="this-page">
	<SvelteFlow bind:nodes bind:edges fitView class="intersection-flow" onnodedrag={onNodeDrag}>
		<Background />
		<Controls />
	</SvelteFlow>
</div>

<style>
	.this-page :global(.svelte-flow__node.highlight) {
		background-color: #ff0072 !important;
		color: white;
	}

	.this-page :global(.intersection-flow .svelte-flow__node) {
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: 700;
		border-radius: 1px;
		border-width: 2px;
		box-shadow: 6px 6px 0 1px rgba(0, 0, 0, 0.7);
	}

	.this-page :global(.intersection-flow .svelte-flow__node.selected),
	.this-page :global(.intersection-flow .svelte-flow__node:hover),
	.this-page :global(.intersection-flow .svelte-flow__node:focus) {
		box-shadow: 6px 6px 0 1px rgba(0, 0, 0, 0.7);
		background-color: #eee;
	}

	.this-page :global(.intersection-flow .svelte-flow__handle) {
		display: none;
	}
</style>
