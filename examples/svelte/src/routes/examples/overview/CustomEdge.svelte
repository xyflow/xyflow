<script lang="ts">
	import { BaseEdge, useEdges, getBezierPath, type EdgeProps, EdgeLabel } from '@xyflow/svelte';

	let { ...props }: EdgeProps = $props();

	let [path, labelX, labelY] = $derived(
		getBezierPath({
			sourceX: props.sourceX,
			sourceY: props.sourceY,
			targetX: props.targetX,
			targetY: props.targetY,
			sourcePosition: props.sourcePosition,
			targetPosition: props.targetPosition
		})
	);

	const edges = useEdges();

	function onClick() {
		edges.current = edges.current.filter((e) => e.id !== props.id);
	}
</script>

<BaseEdge {path} {labelX} {labelY} {...props} />

<EdgeLabel x={labelX} y={labelY} selectEdgeOnClick>
	<button class="edge-button" onclick={onClick}> ✕ </button>
</EdgeLabel>

<style>
	.edge-button {
		border-radius: 50%;
		border: none;
		width: 1rem;
		height: 1rem;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 8px;
		cursor: pointer;
		background-color: #eee;
	}

	.edge-button:hover {
		box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.12);
	}
</style>
