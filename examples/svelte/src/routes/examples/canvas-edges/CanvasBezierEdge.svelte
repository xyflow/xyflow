<script lang="ts">
	import { BaseCanvasEdge, getBezierPath, type EdgeProps, EdgeLabelRenderer } from '@xyflow/svelte';

	type $$Props = EdgeProps;

	export let id: $$Props['id'];
	export let interactionWidth: $$Props['interactionWidth'] = undefined;
	export let label: $$Props['label'] = undefined;
	export let labelStyle: $$Props['labelStyle'] = undefined;

	export let sourceX: $$Props['sourceX'];
	export let sourceY: $$Props['sourceY'];
	export let sourcePosition: $$Props['sourcePosition'];

	export let targetX: $$Props['targetX'];
	export let targetY: $$Props['targetY'];
	export let targetPosition: $$Props['targetPosition'];

	$: [path, labelX, labelY] = getBezierPath({
		sourceX,
		sourceY,
		targetX,
		targetY,
		sourcePosition,
		targetPosition
	});

	$: bounds = {
		x: Math.min(sourceX, targetX),
		y: Math.min(sourceY, targetY),
		width: Math.abs(sourceX - targetX),
		height: Math.abs(sourceY - targetY)
	};
</script>

<BaseCanvasEdge {id} {path} {interactionWidth} {bounds} />
{#if label}
	<EdgeLabelRenderer>
		<div
			class="svelte-flow__edge-label"
			style:transform="translate(-50%, -50%) translate({labelX}px,{labelY}px)"
			style={labelStyle}
		>
			{label}
		</div>
	</EdgeLabelRenderer>
{/if}
