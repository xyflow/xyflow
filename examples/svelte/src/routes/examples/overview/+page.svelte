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
		type Edge,
		ConnectionMode,
		useSvelteFlow,
		ControlButton
	} from '@xyflow/svelte';

	import CustomNode from './CustomNode.svelte';
	import CustomNodeDragHandle from './CustomNodeDragHandle.svelte';
	import CustomEdge from './CustomEdge.svelte';

	import '@xyflow/svelte/dist/style.css';
	import InitTracker from './InitTracker.svelte';

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
		},
		{
			id: 'hideunhide',
			data: { label: 'HIDE ME' },
			position: { x: 300, y: 75 },
			hidden: true
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
		padding: 0.1,
		nodes: [{ id: '1' }, { id: '2' }, { id: '3' }]
	}}
	minZoom={0}
	maxZoom={Infinity}
	selectionMode={SelectionMode.Full}
	initialViewport={{ x: 100, y: 100, zoom: 2 }}
	snapGrid={[25, 25]}
	oninit={() => console.log('on init')}
	on:nodeclick={(event) => console.log('on node click', event)}
	on:nodemouseenter={(event) => console.log('on node enter', event)}
	on:nodemouseleave={(event) => console.log('on node leave', event)}
	on:edgeclick={(event) => console.log('edge click', event)}
	onconnectstart={(event) => console.log('on connect start', event)}
	onconnect={(event) => console.log('on connect', event)}
	onconnectend={(event) => console.log('on connect end', event)}
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
	on:edgecontextmenu={({ detail: { event, edge } }) => {
		event.preventDefault();
		console.log('on edge contextmenu', edge);
	}}
	on:selectionclick={(event) => console.log('on selection click', event)}
	on:selectioncontextmenu={(event) => console.log('on selection contextmenu', event)}
	onbeforedelete={async ({ nodes, edges }) => {
		console.log('on before delete', nodes, edges);
		const deleteElements = confirm('Are you sure you want to delete the selected elements?');
		return deleteElements;
	}}
	autoPanOnConnect
	autoPanOnNodeDrag
	connectionMode={ConnectionMode.Strict}
	attributionPosition={'top-center'}
>
	<Controls>
		<ControlButton slot="before">xy</ControlButton>
		<ControlButton aria-label="log" on:click={() => console.log('control button')}
			>log</ControlButton
		>
	</Controls>
	<Background variant={BackgroundVariant.Dots} />
	<MiniMap />
	<Panel position="top-right">
		<button on:click={updateNode}>update node pos</button>
		<button on:click={updateEdge}>update edge type</button>
		<button
			on:click={() => {
				console.log($nodes, $nodes.length);
				$nodes[$nodes.length - 1].hidden = !$nodes[$nodes.length - 1].hidden;
				$nodes = $nodes;
			}}>hide/unhide</button
		>
	</Panel>

	<InitTracker />
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
