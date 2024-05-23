<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';

	let { id, positionAbsoluteX, positionAbsoluteY, zIndex }: NodeProps = $props();
</script>

<Handle type="target" position={Position.Top} />
<div>{id}</div>
<div>
	x:{Math.round(positionAbsoluteX)} y:{Math.round(positionAbsoluteY)} z:{zIndex}
</div>
<Handle type="source" position={Position.Bottom} />
