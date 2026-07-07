<script lang="ts">
	import { BezierEdge, type EdgeProps } from '@xyflow/svelte';

	let { ...props }: EdgeProps = $props();
</script>

<BezierEdge {...props} pathOptions={{ curvature: 1 }} />
