<script lang="ts">
	import { NodeToolbar, type NodeProps, Handle, Position } from '@xyflow/svelte';

	type $$Props = NodeProps;

	export let data: $$Props['data'];
</script>

<NodeToolbar
	isVisible={data.toolbarVisible}
	position={data.toolbarPosition}
	align={data.toolbarAlign}
>
	<button>delete</button>
	<button>copy</button>
	<button>expand</button>
</NodeToolbar>
<div class="node">
	<div>{data.label}</div>
	<Handle type="target" position={Position.Left} />
	<Handle type="source" position={Position.Right} />
</div>

<style>
	.node {
		width: 200px;
		height: 50px;
		border: solid 1px black;
	}
</style>
