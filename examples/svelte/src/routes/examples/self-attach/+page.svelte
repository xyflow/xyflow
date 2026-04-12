<script lang="ts">
	import {
		SvelteFlow,
		Controls,
		Background,
		BackgroundVariant,
		MiniMap,
		type Node,
		type NodeTypes
	} from '@xyflow/svelte';

	import '@xyflow/svelte/dist/style.css';

	import DebugNode from './DebugNode.svelte';

	const nodeTypes: NodeTypes = {
		debug: DebugNode
	};

	let nodes = $state.raw<Node[]>([
		{
			id: 'debug',
			type: 'debug',
			position: {
				x: 0,
				y: 0
			},
			data: {}
		}
	]);
</script>

<SvelteFlow {nodeTypes} bind:nodes fitView minZoom={0.2} onlyRenderVisibleElements>
	<Controls />
	<Background variant={BackgroundVariant.Lines} />
	<MiniMap />
</SvelteFlow>
