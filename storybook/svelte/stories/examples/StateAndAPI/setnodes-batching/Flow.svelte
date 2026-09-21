<script lang="ts">
	import {
		SvelteFlow,
		Controls,
		Background,
		BackgroundVariant,
		MiniMap,
		Panel,
		useNodes,
		useSvelteFlow,
		type Node,
		type Edge
	} from '@xyflow/svelte';

	import '@xyflow/svelte/dist/style.css';

	const a: Node = { id: 'a', data: { label: 'A' }, position: { x: 250, y: 5 } };
	const b: Node = { id: 'b', data: { label: 'B' }, position: { x: 100, y: 100 } };
	const c: Node = { id: 'c', data: { label: 'C' }, position: { x: 400, y: 100 } };

	let nodes = $state.raw<Node[]>([]);
	let edges = $state.raw<Edge[]>([]);

	const nodesStore = useNodes();
	const { updateNode } = useSvelteFlow();

	const triggerMultipleSetNodes = () => {
		nodesStore.set([a]);
		console.log('now');
		nodesStore.update((nodes) => {
			console.log(nodes.map((node) => node.id));
			return [...nodes, b];
		});
		console.log('now');
		nodesStore.update((nodes) => {
			console.log(nodes.map((node) => node.id));
			return [...nodes, c];
		});
		console.log('now');
		nodesStore.update((nodes) => {
			console.log(nodes.map((node) => node.id));
			return nodes.map((node) =>
				node.id === 'a'
					? { ...node, position: { x: node.position.x + 20, y: node.position.y + 20 } }
					: node
			);
		});
	};

	const triggerMultipleUpdateNodes = () => {
		triggerMultipleSetNodes();
		updateNode('a', (a) => ({ position: { x: a.position.x + 20, y: a.position.y + 20 } }));
		updateNode('b', (b) => ({ position: { x: b.position.x + 20, y: b.position.y + 20 } }));
		updateNode('c', (c) => ({ position: { x: c.position.x + 20, y: c.position.y + 20 } }));
		updateNode('a', (a) => ({ data: { ...a.data, label: `A ${Date.now()}` } }));
		updateNode('b', (b) => ({ data: { ...b.data, label: `B ${Date.now()}` } }));
		updateNode('c', (c) => ({ data: { ...c.data, label: `C ${Date.now()}` } }));
	};
</script>

<main>
	<SvelteFlow
		bind:nodes
		bind:edges
		class="svelte-flow-basic-example"
		minZoom={0.2}
		maxZoom={4}
		fitView
	>
		<Background variant={BackgroundVariant.Dots} />
		<MiniMap />
		<Controls />

		<Panel position="top-right">
			<button onclick={triggerMultipleSetNodes}>queue multiple setNodes calls</button>
			<button onclick={triggerMultipleUpdateNodes}>queue multiple updateNode calls</button>
		</Panel>
	</SvelteFlow>
</main>

<style>
	main {
		height: 100%;
		display: flex;
	}
</style>
