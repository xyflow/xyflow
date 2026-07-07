<script lang="ts">
	import {
		Handle,
		Position,
		type NodeProps,
		NodeResizeControl,
		ResizeControlVariant
	} from '@xyflow/svelte';
	import type { ResizeNode } from './types';

	let { data }: NodeProps<ResizeNode> = $props();
</script>

<NodeResizeControl
	variant={ResizeControlVariant.Handle}
	position="bottom-right"
	resizeDirection="horizontal"
	minWidth={100}
	maxWidth={500}
	color="orange"
	autoScale={false}
/>
<Handle type="target" position={Position.Left} />
<div>{data.label}</div>
<Handle type="source" position={Position.Right} />
