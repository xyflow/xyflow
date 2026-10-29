<script lang="ts">
	import {
		NodeToolbar,
		type NodeProps,
		type Node,
		Handle,
		Position,
		type Align
	} from '@xyflow/svelte';

	let {
		data
	}: NodeProps<
		Node<{ label: string; toolbarPosition: Position; toolbarAlign: Align; toolbarVisible: boolean }>
	> = $props();
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
