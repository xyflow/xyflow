<script lang="ts">
	import {
		SvelteFlow,
		Controls,
		PanOnScrollMode,
		MiniMap,
		type OnMoveEnd,
		type Node,
		type Edge
	} from '@xyflow/svelte';

	import '@xyflow/svelte/dist/style.css';

	let {
		elementsSelectable = false,
		nodesDraggable = false,
		nodesConnectable = false,
		zoomOnScroll = false,
		zoomOnPinch = false,
		panOnScroll = false,
		panOnScrollMode = PanOnScrollMode.Free,
		zoomOnDoubleClick = false,
		panOnDrag = true,
		captureZoomClick = false,
		captureZoomScroll = false,
		captureElementClick = false
	}: {
		elementsSelectable?: boolean;
		nodesDraggable?: boolean;
		nodesConnectable?: boolean;
		zoomOnScroll?: boolean;
		zoomOnPinch?: boolean;
		panOnScroll?: boolean;
		panOnScrollMode?: PanOnScrollMode;
		zoomOnDoubleClick?: boolean;
		panOnDrag?: boolean;
		captureZoomClick?: boolean;
		captureZoomScroll?: boolean;
		captureElementClick?: boolean;
	} = $props();

	let nodes = $state.raw([
		{
			id: '1',
			type: 'input',
			data: { label: 'Node 1' },
			position: { x: 250, y: 5 }
		},
		{ id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
		{ id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 } },
		{ id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 200 } }
	]);

	let edges = $state.raw([
		{ id: 'e1-2', source: '1', target: '2', animated: true },
		{ id: 'e1-3', source: '1', target: '3' }
	]);

	const onnodedragstart = (_: MouseEvent, node: Node) => console.log('drag start', node);
	const onnodedragstop = (_: MouseEvent, node: Node) => console.log('drag stop', node);
	const onnodeclick = (_: MouseEvent, node: Node) => console.log('click', node);
	const onedgeclick = (_: MouseEvent, edge: Edge) => console.log('click', edge);
	const onpaneclick = (event: MouseEvent) => console.log('onPaneClick', event);
	const onpanescroll = (event?: WheelEvent) => console.log('onPaneScroll', event);
	const onpanecontextmenu = (event: MouseEvent) => console.log('onPaneContextMenu', event);
	const onmoveend: OnMoveEnd = (_, viewport) => console.log('onMoveEnd', viewport);
</script>

<SvelteFlow
	bind:nodes
	bind:edges
	elementsSelectable={elementsSelectable}
	nodesConnectable={nodesConnectable}
	nodesDraggable={nodesDraggable}
	{zoomOnScroll}
	{zoomOnPinch}
	{panOnScroll}
	{panOnScrollMode}
	{zoomOnDoubleClick}
	{panOnDrag}
	{onmoveend}
	onnodeclick={captureElementClick ? onnodeclick : undefined}
	onedgeclick={captureElementClick ? onedgeclick : undefined}
	onnodedragstart={onnodedragstart}
	onnodedragstop={onnodedragstop}
	onpaneclick={captureZoomClick ? onpaneclick : undefined}
	onpanescroll={captureZoomScroll ? onpanescroll : undefined}
	onpanecontextmenu={captureZoomClick ? onpanecontextmenu : undefined}
	fitView
>
	<MiniMap />
	<Controls />
</SvelteFlow>
