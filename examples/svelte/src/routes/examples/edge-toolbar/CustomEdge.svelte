<script lang="ts">
	import { getBezierPath, BaseEdge, type EdgeProps, useSvelteFlow } from '@xyflow/svelte';
	import { EdgeToolbar } from '@xyflow/svelte';

	const { deleteElements } = useSvelteFlow();

	let { id, sourceX, sourceY, targetX, targetY }: EdgeProps = $props();

	let [edgePath, labelX, labelY] = $derived(
		getBezierPath({
			sourceX,
			sourceY,
			targetX,
			targetY
		})
	);

	const deleteEdge = () => {
		deleteElements({ edges: [{ id }] });
	};
</script>

<BaseEdge {id} path={edgePath} />
<EdgeToolbar x={labelX} y={labelY} isVisible>
	<button onclick={deleteEdge}>Delete</button>
</EdgeToolbar>
