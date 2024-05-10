<script lang="ts">
	import { Handle, Position, type NodeProps, type Node } from '@xyflow/svelte';

	let { data }: NodeProps<Node<{ colorStore: { color: string } }>> = $props();
</script>

<div class="custom">
	<Handle type="target" position={Position.Left} />
	<div>
		Custom Color Picker Node: <strong>{data.colorStore.color}</strong>
	</div>
	<input class="nodrag" type="color" bind:value={data.colorStore.color} />
	<Handle type="source" position={Position.Right} id="a" style="top: 20px;" />
	<Handle type="source" position={Position.Right} id="b" style="top: auto; bottom: 10px;" />
</div>

<style>
	.custom {
		background-color: white;
		padding: 10px;
		border: 1px solid #777;
		border-radius: 20px;
	}
</style>
