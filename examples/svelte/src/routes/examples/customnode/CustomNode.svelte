<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { Handle, Position, type NodeProps, type Node } from '@xyflow/svelte';

	let { data }: NodeProps<Node<{ colorStore: Writable<string> }>> = $props();

	const { colorStore } = data;
</script>

<div class="custom">
	<Handle type="target" position={Position.Left} />
	<div>
		Custom Color Picker Node: <strong>{$colorStore}</strong>
	</div>
	<input
		class="nodrag"
		type="color"
		oninput={(evt) => colorStore.set(evt.currentTarget.value)}
		value={$colorStore}
	/>
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
