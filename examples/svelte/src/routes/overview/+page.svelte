<script lang="ts">
	import { writable } from 'svelte/store';
	import {
		SvelteFlow,
		Controls,
		Background,
		BackgroundVariant,
		MiniMap,
		Panel,
		SelectionMode,
		type NodeTypes,
		type EdgeTypes,
		type Node,
		type Edge
	} from '@xyflow/svelte';

	import CustomNode from './CustomNode.svelte';
	import CustomNodeDragHandle from './CustomNodeDragHandle.svelte';
	import CustomEdge from './CustomEdge.svelte';

	import '@xyflow/svelte/dist/style.css';

	const nodeTypes: NodeTypes = {
		custom: CustomNode,
		dragHandle: CustomNodeDragHandle
	};

	const edgeTypes: EdgeTypes = {
		custom: CustomEdge
	};

	const nodes = writable<Node[]>([
		{
			id: '1',
			type: 'input',
			data: { label: 'Input Node' },
			position: { x: 150, y: 5 }
		},
		{
			id: '2',
			type: 'default',
			data: { label: 'Node' },
			position: { x: 0, y: 150 },
			selectable: false
		},
		{
			id: 'A',
			type: 'default',
			data: { label: 'Styled with class' },
			class: 'custom-style',
			position: { x: 150, y: 150 }
		},
		{
			id: 'D',
			type: 'default',
			data: { label: 'Not draggable' },
			position: { x: 150, y: 200 },
			draggable: false
		},
		{
			id: '3',
			type: 'output',
			data: { label: 'Output Node' },
			position: { x: 300, y: 150 }
		},
		{
			id: 'B',
			type: 'default',
			data: { label: 'Styled with style' },
			style: 'border: 2px solid #ff5050;',
			position: { x: 450, y: 150 }
		},
		{
			id: 'C',
			type: 'dragHandle',
			data: { label: 'custom drag handle' },
			dragHandle: '.custom-drag-handle',
			position: { x: 450, y: 250 }
		},
		{
			id: '4',
			type: 'custom',
			data: { label: 'Custom Node' },
			position: { x: 150, y: 300 }
		}
	]);

	const edges = writable<Edge[]>([
		{
			id: '1-2',
			type: 'default',
			source: '1',
			target: '2',
			label: 'Edge Text'
		},
		{
			id: '1-3',
			type: 'smoothstep',
			source: '1',
			target: '3',
			selectable: false
		},
		{
			id: '2-4',
			type: 'custom',
			source: '2',
			target: '4',
			animated: true
		}
	]);

	function updateNode() {
		$nodes[0].position.x += 20;
		$nodes = $nodes;
	}

	function updateEdge() {
		$edges[0].type = $edges[0].type === 'default' ? 'smoothstep' : 'default';
		$edges = $edges;
	}

	$: {
		console.log('nodes changed', $nodes);
	}
</script>

<SvelteFlow
	{nodes}
	{edges}
	{nodeTypes}
	{edgeTypes}
	fitView
	fitViewOptions={{
		padding: 10,
		nodes: [
			{
				id: '1'
			}
		]
	}}
	minZoom={0}
	maxZoom={Infinity}
	selectionMode={SelectionMode.Full}
	initialViewport={{ x: 100, y: 100, zoom: 2 }}
	snapGrid={[25, 25]}
	on:nodeclick={(event) => console.log('on node click', event)}
	on:nodemouseenter={(event) => console.log('on node enter', event)}
	on:nodemouseleave={(event) => console.log('on node leave', event)}
	on:edgeclick={(event) => console.log('edge click', event)}
	on:connectstart={(event) => console.log('on connect start', event)}
	on:connect={(event) => console.log('on connect', event)}
	on:connectend={(event) => console.log('on connect end', event)}
	on:paneclick={(event) => console.log('on pane click', event)}
	on:panecontextmenu={(event) => {
		console.log('on pane contextmenu', event);
	}}
	on:nodedrag={(event) => {
		console.log('on node drag', event);
	}}
	on:nodedragstart={(event) => {
		console.log('on node drag start', event);
	}}
	on:nodedragstop={(event) => {
		console.log('on node drag stop', event);
	}}
	on:nodecontextmenu={(event) => {
		event.detail.event.preventDefault();
		console.log('on node contextmenu', event);
	}}
	autoPanOnConnect
	autoPanOnNodeDrag
	defaultEdgeOptions={{
		hidden: false
	}}
>
	<Controls />
	<Background variant={BackgroundVariant.Dots} />
	<MiniMap />
	<Panel position="top-right">
		<button on:click={updateNode}>update node pos</button>
		<button on:click={updateEdge}>update edge type</button>
	</Panel>
</SvelteFlow>

<style>
	:global(.svelte-flow .custom-style) {
		background: #ff5050;
		color: white;
	}

	:root {
		--background-color: #ffffdd;
		--background-pattern-color: #5050ff;

		--minimap-background-color: #f5f6f7;
		--minimap-mask-color: rgb(255, 255, 240, 0.6);

		--controls-button-background-color: #ddd;
		--controls-button-background-color-hover: #ccc;
	}
</style>
