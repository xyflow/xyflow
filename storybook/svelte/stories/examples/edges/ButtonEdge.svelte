<script lang="ts">
	import {
		getBezierPath,
		BaseEdge,
		type EdgeProps,
		useSvelteFlow,
		MarkerType,
		EdgeReconnectAnchor,
		EdgeLabel
	} from '@xyflow/svelte';

	let {
		style,
		markerEnd,
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
		selected
	}: EdgeProps = $props();

	let [edgePath, labelX, labelY] = $derived(
		getBezierPath({
			sourceX,
			sourceY,
			sourcePosition,
			targetX,
			targetY,
			targetPosition
		})
	);

	const { updateEdge } = useSvelteFlow();

	let reconnecting = $state(false);
</script>

{#if !reconnecting}
	<BaseEdge path={edgePath} {markerEnd} {style} />
	<EdgeLabel x={labelX} y={labelY}>
		<button
			class="edgeButton"
			onclick={(event) => {
				event.stopPropagation();
				updateEdge('e5-6', {
					markerEnd: {
						type: MarkerType.Arrow,
						color: '#FFCC00',
						markerUnits: 'userSpaceOnUse',
						width: 20,
						height: 20,
						strokeWidth: 2
					},
					markerStart: {
						type: MarkerType.ArrowClosed,
						color: '#FFCC00',
						orient: 'auto-start-reverse',
						markerUnits: 'userSpaceOnUse',
						width: 20,
						height: 20
					}
				});
			}}
		>
			×
		</button>
	</EdgeLabel>
{/if}

{#if selected}
	<EdgeReconnectAnchor bind:reconnecting type="source" position={{ x: sourceX, y: sourceY }} />
	<EdgeReconnectAnchor bind:reconnecting type="target" position={{ x: targetX, y: targetY }} />
{/if}

<style>
	.edgeButton {
		width: 20px;
		height: 20px;
		background: #eee;
		border: 1px solid #fff;
		cursor: pointer;
		border-radius: 50%;
		font-size: 10px;
	}

	.edgeButton:hover {
		box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.08);
	}
</style>
