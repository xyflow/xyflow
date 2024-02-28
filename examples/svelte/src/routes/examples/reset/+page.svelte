<script lang="ts">
	import { writable } from 'svelte/store';
	import {
		SvelteFlow,
		Controls,
		Background,
		MiniMap,
		type Node,
		type Edge,
		type NodeTypes
	} from '@xyflow/svelte';

	import '@xyflow/svelte/dist/style.css';

	const nodes = writable<Node[]>([]);
	const edges = writable<Edge[]>([]);

	const resetNodesArray = () => {
		const node1: Node = {
			id: 'c1',
			data: { label: '1' },
			position: { x: 0, y: 0 }
		};

		const node2: Node = {
			id: 'c2',
			data: { label: '2' },
			position: { x: 100, y: 0 }
		};

		$nodes = [node1, node2];
	};
</script>

<button on:click={resetNodesArray}> Reset </button>

<div style:height="100vh">
	<SvelteFlow {nodes} {edges} fitView>
		<Controls />
		<Background />
		<MiniMap />
	</SvelteFlow>
</div>
