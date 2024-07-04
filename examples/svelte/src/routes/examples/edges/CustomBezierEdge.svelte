<script lang="ts">
	import { BezierEdge, type EdgeProps } from '@xyflow/svelte';

	type $$Props = EdgeProps;

	export let label: $$Props['label'] = undefined;
	export let labelStyle: $$Props['labelStyle'] = undefined;
	export let style: $$Props['style'] = undefined;
	export let markerStart: $$Props['markerStart'] = undefined;
	export let markerEnd: $$Props['markerEnd'] = undefined;
	export let interactionWidth: $$Props['interactionWidth'] = undefined;

	export let sourceX: $$Props['sourceX'];
	export let sourceY: $$Props['sourceY'];
	export let sourcePosition: $$Props['sourcePosition'];

	export let targetX: $$Props['targetX'];
	export let targetY: $$Props['targetY'];
	export let targetPosition: $$Props['targetPosition'];

	$$restProps;
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
