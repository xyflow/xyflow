<script lang="ts">
	import { getBezierPath, BaseEdge, type EdgeProps, EdgeLabelRenderer } from '@xyflow/svelte';

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

	$: [edgePath, labelX, labelY] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition
	});

	source;
	target;
	animated;
	selected;
	data;
	label;
	labelStyle;
	markerStart;
	interactionWidth;
	sourceHandleId;
	targetHandleId;
</script>

<BaseEdge path={edgePath} {markerEnd} {style} />
<EdgeLabelRenderer>
	<div
		class="edgeButtonContainer nodrag nopan"
		style:transform="translate(-50%, -50%) translate({labelX}px,{labelY}px)"
	>
		<button
			class="edgeButton"
			on:click={(event) => {
				event.stopPropagation();
				alert(`remove ${id}`);
			}}
		>
			×
		</button>
	</div>
</EdgeLabelRenderer>

<style>
	.edgeButtonContainer {
		position: absolute;
		font-size: 12pt;
		/* everything inside EdgeLabelRenderer has no pointer events by default */
		/* if you have an interactive element, set pointer-events: all */
		pointer-events: all;
	}

	.edgeButton {
		width: 20px;
		height: 20px;
		background: #eee;
		border: 1px solid #fff;
		cursor: pointer;
		border-radius: 50%;
		font-size: 12px;
		line-height: 1;
	}

	.edgeButton:hover {
		box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.08);
	}
</style>
