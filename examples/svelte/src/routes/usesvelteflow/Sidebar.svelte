<script lang="ts">
	import { useNodes, useSvelteFlow } from '@xyflow/svelte';

	const {
		zoomIn,
		zoomOut,
		setZoom,
		fitView,
		setCenter,
		setViewport,
		getViewport,
		viewport,
		toObject
	} = useSvelteFlow();

	const nodes = useNodes();
</script>

<aside>
	<div class="label">Functions:</div>
	<button on:click={() => zoomIn()}>zoom in</button>
	<button on:click={() => zoomOut({ duration: 1000 })}>zoom out transition</button>
	<button on:click={() => setZoom(2)}>set zoom</button>
	<button on:click={() => fitView()}>fitView</button>
	<button on:click={() => setCenter(0, 0)}>setCenter 0, 0</button>
	<button on:click={() => setViewport({ x: 100, y: 100, zoom: 2 })}>setViewport</button>
	<button on:click={() => console.log(getViewport())}>getViewport</button>
	<button
		on:click={() => {
			const { nodes, edges, viewport } = toObject();
			console.log(nodes, edges, viewport);
		}}>toObject</button
	>

	<div class="label">Nodes:</div>
	{#each $nodes as node (node.id)}
		<div>id: {node.id} | x: {node.position.x.toFixed(1)} y: {node.position.y.toFixed(1)}</div>
	{/each}

	<div class="label">Viewport:</div>
	<div>
		x: {$viewport.x.toFixed(1)} y: {$viewport.y.toFixed(1)} zoom: {$viewport.zoom.toFixed(1)}
	</div>
</aside>

<style>
	.label {
		font-weight: 700;
		margin: 0.5rem 0 0.25rem 0;
	}

	aside {
		width: 20vw;
		background: #f4f4f4;
		padding: 0.4rem 0.8rem;
		font-size: 12px;
	}

	button {
		display: block;
		margin-bottom: 0.5rem;
		font-size: 12px;
	}
</style>
