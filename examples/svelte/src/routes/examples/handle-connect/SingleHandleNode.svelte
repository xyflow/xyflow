<script lang="ts">
	import { Handle, Position, type NodeProps, type Connection } from '@xyflow/svelte';

	type $$Props = NodeProps;

	export let id: $$Props['id'];

	function onConnectTarget(connection: Connection[]) {
		console.log('connect target', connection);
	}

	function onConnectSource(connection: Connection[]) {
		console.log('connect source', connection);
	}

	function onDisconnectTarget(connection: Connection[]) {
		console.log('disconnect target', connection);
	}

	function onDisconnectSource(connection: Connection[]) {
		console.log('disconnect source', connection);
	}

	export let data: $$Props['data'];
	export let targetPosition: $$Props['targetPosition'] = Position.Top;
	export let sourcePosition: $$Props['sourcePosition'] = Position.Bottom;
	export let width: $$Props['width'] = undefined;
	export let height: $$Props['height'] = undefined;
	export let selected: $$Props['selected'] = undefined;
	export let type: $$Props['type'] = undefined;
	export let zIndex: $$Props['zIndex'] = undefined;
	export let dragging: $$Props['dragging'] = false;
	export let dragHandle: $$Props['dragHandle'] = undefined;
	export let positionAbsolute: $$Props['positionAbsolute'] = {
		x: 0,
		y: 0
	};
	export let isConnectable: $$Props['isConnectable'] = undefined;

	data;
	targetPosition;
	sourcePosition;
	width;
	height;
	selected;
	type;
	zIndex;
	dragging;
	dragHandle;
	positionAbsolute;
	isConnectable;
</script>

<div class="custom">
	<Handle
		type="target"
		position={Position.Left}
		onconnect={onConnectTarget}
		ondisconnect={onDisconnectTarget}
	/>
	<div>node {id}</div>
	<Handle
		type="source"
		position={Position.Right}
		onconnect={onConnectSource}
		ondisconnect={onDisconnectSource}
	/>
</div>

<style>
	.custom {
		background-color: #333;
		padding: 10px;
		border-radius: 10px;
		color: #fff;
	}
</style>
