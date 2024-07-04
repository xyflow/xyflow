<script lang="ts">
	import { SvelteFlow } from '@xyflow/svelte';
	import { Background, BackgroundVariant, type Edge, type Node } from '@xyflow/svelte';
	import { writable } from 'svelte/store';

	import CustomNode from './CustomNode.svelte';
	import ConnectionLine from './ConnectionLine.svelte';

	import '@xyflow/svelte/dist/style.css';

	const nodeTypes = {
		custom: CustomNode
	};

	const nodes = writable<Node[]>([
		{
			id: 'connectionline-1',
			type: 'custom',
			data: { label: 'Node 1' },
			position: { x: 250, y: 5 }
		}
	]);

	const edges = writable<Edge[]>([]);
</script>

<div style="height:100vh;">
	<SvelteFlow {nodeTypes} {nodes} {edges} fitView>
		<ConnectionLine slot="connectionLine" />
		<Background variant={BackgroundVariant.Lines} />
	</SvelteFlow>
</div>

<style>
</style>
