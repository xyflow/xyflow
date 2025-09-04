<script lang="ts">
	let {
		x,
		y,
		width,
		height,
		selected,
	}: {
		x: number;
		y: number;
		width: number;
		height: number;
		selected?: boolean;
	} = $props();
</script>

<circle 
	cx={x + width / 2}
	cy={y + height / 2} 
	r={Math.min(width, height) - 2} 
	fill={selected ? "#ff6b6b" : "#ffcc00"}
/>