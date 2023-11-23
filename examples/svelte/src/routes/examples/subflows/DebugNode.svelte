<script lang="ts">
	import { Handle, Position, type NodeProps, type XYPosition } from '@xyflow/svelte';

	type $$Props = NodeProps;

	export let id: string;
	export let positionAbsolute: XYPosition = { x: 0, y: 0 };
	export let zIndex: number = 0;
</script>

<Handle type="target" position={Position.Top} />
<div>{id}</div>
<div>
	x:{Math.round(positionAbsolute.x)} y:{Math.round(positionAbsolute.y)} z:{zIndex}
</div>
<Handle type="source" position={Position.Bottom} />
