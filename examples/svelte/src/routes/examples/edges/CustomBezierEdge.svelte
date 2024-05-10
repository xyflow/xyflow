<script lang="ts">
	import { BezierEdge, type EdgeProps } from '@xyflow/svelte';

	let {
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
		label,
		labelStyle,
		markerStart,
		markerEnd,
		style,
		interactionWidth
	}: EdgeProps = $props();
</script>

<BezierEdge
	{sourceX}
	{sourceY}
	{sourcePosition}
	{targetX}
	{targetY}
	{targetPosition}
	{label}
	{labelStyle}
	{markerStart}
	{markerEnd}
	{style}
	{interactionWidth}
	pathOptions={{ curvature: 1 }}
/>
