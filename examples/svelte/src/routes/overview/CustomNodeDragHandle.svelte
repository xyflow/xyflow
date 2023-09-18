<script lang="ts">
	import type { NodeProps } from '@xyflow/svelte';

	type $$Props = NodeProps;

	export let data: { label: string } = { label: 'Node' };
</script>

<div class="custom">
	<div>{data.label}</div>
	<div class="custom-drag-handle" style="width:15px;height:15px;background:#222;" />
</div>

<style>
	.custom {
		background: white;
		padding: 10px;
	}
</style>
