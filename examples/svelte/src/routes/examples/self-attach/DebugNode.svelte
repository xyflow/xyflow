<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';

	let { id, positionAbsoluteX, positionAbsoluteY, ...rest }: NodeProps = $props();

	rest;
</script>

<div style:margin-bottom="10px">
	x:{Math.round(positionAbsoluteX)} y:{Math.round(positionAbsoluteY)}
</div>

<Handle
	type="source"
	position={Position.Bottom}
	isConnectable
	isConnectableStart
	isConnectableEnd={false}
/>
