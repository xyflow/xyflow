<script lang="ts">
	import { writable } from 'svelte/store';
	import {
		SvelteFlow,
		Controls,
		Background,
		BackgroundVariant,
		MiniMap,
		type NodeTypes,
		useSvelteFlow,
		Panel
	} from '@xyflow/svelte';

	import CustomNode from './CustomNode.svelte';

	import '@xyflow/svelte/dist/style.css';

	const nodeTypes: NodeTypes = {
		custom: CustomNode
	};

	const nodes = writable([
		{
			id: '1',
			type: 'custom',
			data: { label: 'Input Node' },
			position: { x: 150, y: 0 }
		},
		{
			id: '2',
			type: 'default',
			data: { label: 'Node' },
			position: { x: 0, y: 150 }
		},
		{
			id: '3',
			type: 'output',
			data: { label: 'Output Node' },
			position: { x: 300, y: 150 }
		}
	]);

	const edges = writable([
		{
			id: '1-2',
			source: '1',
			target: '2'
		},
		{
			id: '1-3',
			source: '1',
			target: '3'
		}
	]);

	const { updateNode } = useSvelteFlow();

	const updateNodePosition = () => {
		updateNode('1', (node) => ({ position: { x: node.position.x + 10, y: node.position.y } }));
	};
</script>

<main>
	<SvelteFlow {nodes} {edges} {nodeTypes} fitView>
		<Controls />
		<Background variant={BackgroundVariant.Dots} />
		<MiniMap />

		<Panel><button on:click={updateNodePosition}>update node</button></Panel>
	</SvelteFlow>
</main>

<style>
	main {
		height: 100%;
		display: flex;
	}
</style>
