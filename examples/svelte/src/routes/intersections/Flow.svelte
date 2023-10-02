<script lang="ts">
	import { SvelteFlow, Background, Controls, useSvelteFlow } from '@xyflow/svelte';
	import type { Edge, Node } from '@xyflow/svelte';
	import { writable } from 'svelte/store';

	import '@xyflow/svelte/dist/style.css';

	import { initialNodes, initialEdges } from './nodes-and-edges';

	const nodes = writable<Node[]>(initialNodes);
	const edges = writable<Edge[]>(initialEdges);

	const { getIntersectingNodes } = useSvelteFlow();

	function onNodeDrag({ detail: { node } }) {
		const intersections = getIntersectingNodes(node).map((n) => n.id);

		$nodes.forEach((n) => {
			n.class = intersections.includes(n.id) ? 'highlight' : '';
		});
		$nodes = $nodes;
	}
</script>

<div style="height:100vh;">
	<SvelteFlow {nodes} {edges} fitView class="intersection-flow" on:nodedrag={onNodeDrag}>
		<Background />
		<Controls />
	</SvelteFlow>
</div>

<style>
	:global(.svelte-flow__node.highlight) {
		background-color: #ff0072 !important;
		color: white;
	}

	:global(.intersection-flow .svelte-flow__node) {
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: 700;
		border-radius: 1px;
		border-width: 2px;
		box-shadow: 6px 6px 0 1px rgba(0, 0, 0, 0.7);
	}

	:global(
			.intersection-flow .svelte-flow__node.selected,
			.intersection-flow .svelte-flow__node:hover,
			.intersection-flow .svelte-flow__node:focus
		) {
		box-shadow: 6px 6px 0 1px rgba(0, 0, 0, 0.7);
		background-color: #eee;
	}

	:global(.intersection-flow .svelte-flow__handle) {
		display: none;
	}
</style>
