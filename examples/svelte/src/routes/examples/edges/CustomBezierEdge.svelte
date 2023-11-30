<script lang="ts">
	import { BezierEdge, type EdgeProps } from '@xyflow/svelte';

	type $$Props = EdgeProps;

	export let id: $$Props['id'] = '';
	export let source: $$Props['source'] = '';
	export let target: $$Props['target'] = '';
	export let animated: $$Props['animated'] = undefined;
	export let selected: $$Props['selected'] = undefined;
	export let label: $$Props['label'] = undefined;
	export let labelStyle: $$Props['labelStyle'] = undefined;
	export let data: $$Props['data'] = undefined;
	export let style: $$Props['style'] = undefined;
	export let markerStart: $$Props['markerStart'] = undefined;
	export let markerEnd: $$Props['markerEnd'] = undefined;
	export let interactionWidth: $$Props['interactionWidth'] = undefined;

	export let sourceX: $$Props['sourceX'];
	export let sourceY: $$Props['sourceY'];
	export let sourcePosition: $$Props['sourcePosition'];
	export let sourceHandleId: $$Props['sourceHandleId'] = undefined;

	export let targetX: $$Props['targetX'];
	export let targetY: $$Props['targetY'];
	export let targetPosition: $$Props['targetPosition'];
	export let targetHandleId: $$Props['targetHandleId'] = undefined;

	id;
	source;
	target;
	animated;
	selected;
	data;
	sourcePosition;
	targetPosition;
	sourceHandleId;
	targetHandleId;
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
