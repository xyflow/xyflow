<script lang="ts">
	import { useSvelteFlow, type NodeProps } from '@xyflow/svelte';

	let {}: NodeProps = $props();

	// long enough for a test to interrupt the transition halfway
	const duration = 5000;

	const { fitView, setCenter, setViewport, setZoom, zoomIn } = useSvelteFlow();

	let status = $state('idle');

	async function track(name: string, transition: () => Promise<boolean>) {
		status = `${name}: pending`;
		await transition();
		status = `${name}: settled`;
	}

	function setCenterThenSetViewport() {
		const transition = setCenter(800, 600, { zoom: 2, duration });
		setViewport({ x: 0, y: 0, zoom: 1 });
		return transition;
	}

	function fitViewTwice() {
		const transition = fitView({ nodes: [{ id: 'target' }], duration });
		setTimeout(() => fitView({ nodes: [{ id: 'transitions' }], duration: 2000 }), 500);
		return transition;
	}
</script>

<div class="container">
	<button
		class="nodrag"
		onclick={() => track('fit view', () => fitView({ nodes: [{ id: 'target' }], duration }))}
	>
		fit view
	</button>
	<button
		class="nodrag"
		onclick={() => track('set center', () => setCenter(800, 600, { zoom: 2, duration }))}
	>
		set center
	</button>
	<button class="nodrag" onclick={() => track('zoom to', () => setZoom(2, { duration }))}>
		zoom to
	</button>
	<button class="nodrag" onclick={() => track('zoom in', () => zoomIn({ duration }))}>
		zoom in
	</button>
	<button
		class="nodrag"
		onclick={() => track('set center then set viewport', setCenterThenSetViewport)}
	>
		set center then set viewport
	</button>
	<button class="nodrag" onclick={() => track('fit view twice', fitViewTwice)}>
		fit view twice
	</button>
	<div data-testid="transition-status">{status}</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 8px;
		background: white;
	}
</style>
