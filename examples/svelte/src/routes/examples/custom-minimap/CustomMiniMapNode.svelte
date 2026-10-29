<script lang="ts">
	import type { MiniMapNodeProps } from '@xyflow/svelte';

	let { id, x, y, width, height, selected }: MiniMapNodeProps = $props();
</script>

<circle
	cx={x + width / 2}
	cy={y + height / 2}
	r={Math.min(width, height) - 2}
	fill={selected ? '#ff6b6b' : '#ffcc00'}
/>
<text
	x={x + width / 2}
	y={y + height / 2}
	text-anchor="middle"
	dominant-baseline="middle"
	fill="blue"
	stroke-width="0.5"
	font-size="100"
	font-family="Arial, sans-serif"
	font-weight="bold"
>
	{id}
</text>
