<script lang="ts">
	import {
		BaseEdge,
		EdgeLabelRenderer,
		useEdges,
		type EdgeProps,
		getBezierPath
	} from '@xyflow/svelte';

	let {
		id,
		sourceX,
		sourceY,
		targetX,
		targetY,
		sourcePosition,
		targetPosition,
		...rest
	}: EdgeProps = $props();

	let [path, labelX, labelY] = $derived(
		getBezierPath({
			sourceX,
			sourceY,
			targetX,
			targetY,
			sourcePosition,
			targetPosition
		})
	);

	let edges = useEdges();

	function onClick() {
		edges = edges.filter((e) => e.id !== id);
		// edges.update((eds) => eds.filter((e) => e.id !== id));
	}
</script>

<BaseEdge {path} {labelX} {labelY} {...rest} />

<EdgeLabelRenderer>
	<button
		style:transform={`translate(-50%,-50%) translate(${labelX}px,${labelY}px)`}
		class="edge-button"
		onclick={onClick}
	>
		✕
	</button>
</EdgeLabelRenderer>

<style>
	.edge-button {
		border-radius: 50%;
		position: absolute;
		border: none;
		width: 1rem;
		height: 1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 8px;
		pointer-events: all;
		cursor: pointer;
		background-color: #eee;
	}

	.edge-button:hover {
		box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.12);
	}
</style>
