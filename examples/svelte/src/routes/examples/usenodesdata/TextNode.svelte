<script lang="ts">
	import { Handle, Position, type NodeProps, useSvelteFlow } from '@xyflow/svelte';

	type $$Props = NodeProps;

	interface Props {
		id: $$Props['id'];
		data: $$Props['data'];
		[key: string]: any
	}

	let { id, data, ...rest }: Props = $props();

	const { updateNodeData } = useSvelteFlow();
	rest;
</script>

<div class="custom">
	<div>node {id}</div>
	<div>
		<input
			value={data.text}
			oninput={(evt) => updateNodeData(id, { text: evt.currentTarget.value })}
		/>
	</div>
	<Handle type="source" position={Position.Right} />
</div>

<style>
	.custom {
		background-color: #eee;
		padding: 10px;
		border-radius: 10px;
	}
</style>
