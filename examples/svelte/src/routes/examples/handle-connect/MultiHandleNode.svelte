<script lang="ts">
	import {
		Handle,
		Position,
		type NodeProps,
		type Connection,
		useHandleConnections
	} from '@xyflow/svelte';

	type $$Props = NodeProps;

	export let id: $$Props['id'];

	function onConnectTarget(connection: Connection[]) {
		console.log('connect target', connection);
	}

	function onConnectSource(handleId: string, connection: Connection[]) {
		console.log('connect source', handleId, connection);
	}

	function onDisconnectTarget(connection: Connection[]) {
		console.log('disconnect target', connection);
	}

	function onDisconnectSource(handleId: string, connection: Connection[]) {
		console.log('disconnect source', handleId, connection);
	}

	const connections = useHandleConnections({ nodeId: id, type: 'target' });

	$: {
		console.log('connections', id, $connections);
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
	export let positionAbsoluteX: $$Props['positionAbsoluteX'] = 0;
	export let positionAbsoluteY: $$Props['positionAbsoluteY'] = 0;
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
	positionAbsoluteX;
	positionAbsoluteY;
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
		id="a"
		type="source"
		position={Position.Right}
		onconnect={(connections) => onConnectSource('a', connections)}
		ondisconnect={(connections) => onDisconnectSource('a', connections)}
		class="source-a"
	/>
	<Handle
		id="b"
		type="source"
		position={Position.Right}
		onconnect={(connections) => onConnectSource('b', connections)}
		ondisconnect={(connections) => onDisconnectSource('b', connections)}
		class="source-b"
	/>
</div>

<style>
	.custom {
		background-color: #333;
		padding: 10px;
		border-radius: 10px;
		color: #fff;
	}

	.custom :global(.source-a) {
		top: 5px;
		transform: translate(50%, 0);
	}

	.custom :global(.source-b) {
		bottom: 5px;
		top: auto;
		transform: translate(50%, 0);
	}
</style>
