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
	import CanvasBezierEdge from '../canvas-edges/CanvasBezierEdge.svelte';

	const yNodes = 80;
	const xNodes = 20;

	const nodeItems: Node[] = [];
	const edgeItems: Edge[] = [];

	let source = null;

	for (let y = 0; y < yNodes; y++) {
		for (let x = 0; x < xNodes; x++) {
			const position = { x: x * 200, y: y * 50 };
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
				const edge: Edge = {
					id: `${source.id}-${id}`,
					source: source.id,
					target: id,
					type: 'canvas-edge',
					noDom: true
				};
				edgeItems.push(edge);
			}

			source = node;
		}
	}

	const nodes = writable(nodeItems);
	const edges = writable(edgeItems);
	console.log($edges);

	const edgeTypes = {
		'canvas-edge': CanvasBezierEdge
	};
</script>

<SvelteFlow {nodes} {edges} {edgeTypes} fitView minZoom={0.2}>
	<Controls />
	<Background variant={BackgroundVariant.Lines} />
	<MiniMap />
</SvelteFlow>
