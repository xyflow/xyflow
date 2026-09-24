<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';

	let { id, positionAbsoluteX, positionAbsoluteY, ...rest }: NodeProps = $props();

	rest;
</script>

<div style:margin-bottom="10px">End</div>

<Handle
	type="target"
	position={Position.Bottom}
	isConnectable
	isConnectableStart={false}
	isConnectableEnd
/>
