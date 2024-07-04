<script lang="ts">
	import { writable } from 'svelte/store';
	import {
		SvelteFlow,
		Background,
		type Edge,
		type Node,
		Position,
		type NodeTypes
	} from '@xyflow/svelte';

	import '@xyflow/svelte/dist/style.css';

	import CustomNode from './CustomNode.svelte';
	import SelectedNodesToolbar from './SelectedNodesToolbar.svelte';

	const nodeTypes: NodeTypes = {
		custom: CustomNode
	};

	const positions = ['top', 'right', 'bottom', 'left'];
	const alignments = ['start', 'center', 'end'];

	const initialNodes: Node[] = [
		{
			id: 'default-node',
			type: 'custom',
			data: { label: 'toolbar top', toolbarPosition: Position.Top },
			position: { x: 0, y: -200 },
			class: 'react-flow__node-default'
		}
	];

	positions.forEach((position, posIndex) => {
		alignments.forEach((align, alignIndex) => {
			const id = `node-${align}-${position}`;
			initialNodes.push({
				id,
				type: 'custom',
				data: {
					label: `toolbar ${position} ${align}`,
					toolbarPosition: position as Position,
					toolbarAlign: align,
					toolbarVisible: true
				},
				class: 'react-flow__node-default',
				position: { x: posIndex * 300, y: alignIndex * 100 }
			});
		});
	});

	const initialEdges: Edge[] = [];

	const nodes = writable<Node[]>(initialNodes);
	const edges = writable<Edge[]>(initialEdges);
</script>

<div style="height: 100vh;">
	<SvelteFlow {nodes} {edges} {nodeTypes} fitView>
		<Background />
		<SelectedNodesToolbar />
	</SvelteFlow>
</div>
