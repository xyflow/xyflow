<script lang="ts">
	import { Handle, Position, type NodeProps, type Node } from '@xyflow/svelte';

	let { data }: NodeProps<Node> = $props();
</script>

<div class="custom">
	<div>
		{data.label}
	</div>

	<Handle type="target" position={Position.Left} />
	<Handle type="source" position={Position.Right}>
		<button class="detached-handle">➡️</button>
	</Handle>
</div>

<style>
	.custom {
		background-color: white;
		padding: 10px;
		border: 1px solid #777;
		border-radius: 20px;
	}

	.detached-handle {
		position: absolute;
		top: 50%;
		left: 1rem;
		transform: translateY(-50%);
		width: 2rem;
		height: 2rem;
		border: none;
		border-radius: 50%;
	}
</style>
