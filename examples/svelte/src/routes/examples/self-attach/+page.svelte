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

	import ConnectableStart from './ConnectableStart.svelte';
	import ConnectableEnd from './ConnectableEnd.svelte';
	import UnconnectableTarget from './UnconnectableTarget.svelte';

	const nodeTypes: NodeTypes = {
		start: ConnectableStart,
		end: ConnectableEnd,
		unconnectable: UnconnectableTarget
	};

	let nodes = $state.raw<Node[]>([
		{
			id: 'start-1',
			type: 'start',
			position: {
				x: 0,
				y: 0
			},
			data: {}
		},
		{
			id: 'start-2',
			type: 'start',
			position: {
				x: -50,
				y: -50
			},
			data: {}
		},
		{
			id: 'second',
			type: 'end',
			position: {
				x: 50,
				y: 50
			},
			data: {}
		},
		{
			id: 'unconnectable-1',
			type: 'unconnectable',
			position: {
				x: 150,
				y: -50
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
