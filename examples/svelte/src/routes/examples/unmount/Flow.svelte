<script lang="ts">
	import {
		SvelteFlow,
		Controls,
		Background,
		BackgroundVariant,
		MiniMap,
		type Node,
		type Edge,
		useStore
	} from '@xyflow/svelte';

	import '@xyflow/svelte/dist/style.css';

	let mounted = $state(true);

	let nodes = $state.raw<Node[]>([
		{
			id: '1',
			type: 'input',
			data: { label: 'Input Node' },
			position: { x: 150, y: 5 }
		},
		{
			id: '2',
			data: { label: 'Node' },
			position: { x: 0, y: 150 }
		},
		{
			id: '3',
			type: 'output',
			data: { label: 'Output Node' },
			position: { x: 300, y: 150 }
		}
	]);

	let edges = $state.raw<Edge[]>([
		{
			id: '1-2',
			source: '1',
			target: '2',
			label: 'Edge Text'
		},
		{
			id: '1-3',
			type: 'smoothstep',
			source: '1',
			target: '3'
		}
	]);

	let _firstMount = true;
	const firstMount = $derived(mounted && _firstMount);

	let store = $derived(useStore());

	$effect(() => {
		console.log(store.onconnect);
	});
</script>

<div class="wrapper">
	<button
		onclick={() => {
			mounted = !mounted;
			_firstMount = false;
		}}
	>
		{mounted ? 'unmount flow' : 'mount flow'}
	</button>

	{#if mounted}
		<div class="flow">
			{#if firstMount}
				<SvelteFlow
					bind:nodes
					bind:edges
					fitView
					onconnect={() => {
						console.log('connect');
					}}
				>
					<Controls />
					<Background variant={BackgroundVariant.Dots} />
					<MiniMap />
				</SvelteFlow>
			{:else}
				<SvelteFlow bind:nodes bind:edges fitView>
					<Controls />
					<Background variant={BackgroundVariant.Dots} />
					<MiniMap />
				</SvelteFlow>
			{/if}
		</div>
	{/if}
</div>

<style>
	.wrapper {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.flow {
		flex: 1;
		min-height: 0;
	}
</style>
