<script lang="ts">
	import { getBezierPath, BaseEdge, type EdgeProps, EdgeLabelRenderer } from '@xyflow/svelte';

	type $$Props = EdgeProps;



	interface Props {
		id?: $$Props['id'];
		style?: $$Props['style'];
		markerEnd?: $$Props['markerEnd'];
		sourceX: $$Props['sourceX'];
		sourceY: $$Props['sourceY'];
		sourcePosition: $$Props['sourcePosition'];
		targetX: $$Props['targetX'];
		targetY: $$Props['targetY'];
		targetPosition: $$Props['targetPosition'];
		[key: string]: any
	}

	let {
		id = '',
		style = undefined,
		markerEnd = undefined,
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
		...rest
	}: Props = $props();

	rest;

	let [edgePath, labelX, labelY] = $derived(getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition
	}));
</script>

<BaseEdge path={edgePath} {markerEnd} {style} />
<EdgeLabelRenderer>
	<div
		class="edgeButtonContainer nodrag nopan"
		style:transform="translate(-50%, -50%) translate({labelX}px,{labelY}px)"
	>
		<button
			class="edgeButton"
			onclick={(event) => {
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
