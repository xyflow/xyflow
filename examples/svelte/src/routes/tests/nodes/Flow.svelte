<script lang="ts">
	import { writable } from 'svelte/store';
	import { initialNodes, initialEdges } from './nodesAndEdges';
	import { SvelteFlow } from '@xyflow/svelte';

	import DragHandleNode from './DragHandleNode.svelte';

	import '@xyflow/svelte/dist/style.css';

	const nodes = writable(initialNodes);
	const edges = writable(initialEdges);

	const nodeTypes = {
		DragHandleNode
	};
</script>

<SvelteFlow {nodes} {nodeTypes} {edges} fitView />
