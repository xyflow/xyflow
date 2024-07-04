<script lang="ts">
	import { writable } from 'svelte/store';
	import {
		SvelteFlow,
		Controls,
		Background,
		BackgroundVariant,
		MiniMap,
		type Node,
		type Edge
	} from '@xyflow/svelte';

	import '@xyflow/svelte/dist/style.css';

	const yNodes = 25;
	const xNodes = 25;

	const nodeItems: Node[] = [];
	const edgeItems: Edge[] = [];

	let source = null;

	for (let y = 0; y < yNodes; y++) {
		for (let x = 0; x < xNodes; x++) {
			const position = { x: x * 100, y: y * 50 };
			const id = `${x}-${y}`;
			const data = { label: `Node ${id}` };
			const node = {
				id,
				data,
				position,
				type: 'default'
			};
			nodeItems.push(node);

			if (source) {
				const edge = {
					id: `${source.id}-${id}`,
					source: source.id,
					target: id
				};
				edgeItems.push(edge);
			}

			source = node;
		}
	}

	const nodes = writable(nodeItems);
	const edges = writable(edgeItems);
</script>

<SvelteFlow {nodes} {edges} fitView minZoom={0.2}>
	<Controls />
	<Background variant={BackgroundVariant.Lines} />
	<MiniMap />
</SvelteFlow>
