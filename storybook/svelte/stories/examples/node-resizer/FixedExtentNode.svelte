<script lang="ts">
	import { Handle, NodeResizer, Position, ViewportPortal, type NodeProps } from '@xyflow/svelte';
	import type { ResizeNode } from './types';

	let { data }: NodeProps<ResizeNode> = $props();
</script>

<NodeResizer minWidth={100} minHeight={30} />
<Handle type="target" position={Position.Left} />
<div style="padding: 10px;">{data.label}</div>
{#if data.extent}
	<ViewportPortal target="back">
		<div
			style:transform={`translate(${data.extent[0][0]}px, ${data.extent[0][1]}px)`}
			style:position="absolute"
			style:width={`${data.extent[1][0] - data.extent[0][0]}px`}
			style:height={`${data.extent[1][1] - data.extent[0][1]}px`}
			style:background-color="rgb(255, 0, 0, 0.25)"
		></div>
	</ViewportPortal>
{/if}
