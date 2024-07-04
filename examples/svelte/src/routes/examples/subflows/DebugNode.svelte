<script lang="ts">
	import { Handle, Position, type NodeProps } from '@xyflow/svelte';

	type $$Props = NodeProps;

	export let id: string;
	export let positionAbsoluteX: number = 0;
	export let positionAbsoluteY: number = 0;
	export let zIndex: number = 0;

	$$restProps;
</script>

<Handle type="target" position={Position.Top} />
<div>{id}</div>
<div>
	x:{Math.round(positionAbsoluteX)} y:{Math.round(positionAbsoluteY)} z:{zIndex}
</div>
<Handle type="source" position={Position.Bottom} />
