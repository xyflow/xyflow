<script lang="ts">
	import { SvelteFlow, Controls, Background, MiniMap, type AriaLabelConfig } from '@xyflow/svelte';

	import '@xyflow/svelte/dist/style.css';

	let {
		autoPanOnNodeFocus = true,
		ariaNodeDefault = 'Svelte Custom Node Desc.',
		ariaNodeKeyboardDisabled = 'Svelte Custom Keyboard Desc.',
		ariaNodeLiveMessagePrefix = 'Custom Moved selected node',
		ariaEdgeDefault = 'Svelte Custom Edge Desc.',
		ariaControlsLabel = 'Svelte Custom Control Aria Label',
		ariaControlsZoomIn = 'Svelte Custom Zoom in',
		ariaControlsZoomOut = 'Svelte Custom Zoom Out',
		ariaControlsInteractive = 'Svelte Custom Toggle Interactivity',
		ariaMinimap = 'Svelte Custom Minimap'
	}: {
		autoPanOnNodeFocus?: boolean;
		ariaNodeDefault?: string;
		ariaNodeKeyboardDisabled?: string;
		ariaNodeLiveMessagePrefix?: string;
		ariaEdgeDefault?: string;
		ariaControlsLabel?: string;
		ariaControlsZoomIn?: string;
		ariaControlsZoomOut?: string;
		ariaControlsInteractive?: string;
		ariaMinimap?: string;
	} = $props();

	let nodes = $state.raw([
		{
			id: 'A',
			position: { x: 0, y: 0 },
			data: { label: 'A' }
		},
		{ id: 'B', position: { x: -100, y: 150 }, data: { label: 'B' } },
		{ id: 'C', position: { x: 1000, y: 150 }, data: { label: 'C' } },
		{ id: 'D', position: { x: 0, y: 260 }, data: { label: 'D' } }
	]);

	let edges = $state.raw([
		{ id: 'A-B', source: 'A', target: 'B' },
		{ id: 'A-C', source: 'A', target: 'C' },
		{ id: 'A-D', source: 'A', target: 'D' }
	]);

	const ariaLabelConfig = $derived<Partial<AriaLabelConfig>>({
		'node.a11yDescription.default': ariaNodeDefault,
		'node.a11yDescription.keyboardDisabled': ariaNodeKeyboardDisabled,
		'node.a11yDescription.ariaLiveMessage': ({ direction, x, y }) =>
			`${ariaNodeLiveMessagePrefix} ${direction}. New position, x: ${x}, y: ${y}`,
		'edge.a11yDescription.default': ariaEdgeDefault,
		'controls.ariaLabel': ariaControlsLabel,
		'controls.zoomIn.ariaLabel': ariaControlsZoomIn,
		'controls.zoomOut.ariaLabel': ariaControlsZoomOut,
		'controls.interactive.ariaLabel': ariaControlsInteractive,
		'minimap.ariaLabel': ariaMinimap
	});
</script>

<SvelteFlow bind:nodes bind:edges {autoPanOnNodeFocus} {ariaLabelConfig}>
	<Controls />
	<Background />
	<MiniMap />
</SvelteFlow>
