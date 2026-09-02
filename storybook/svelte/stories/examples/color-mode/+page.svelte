<script lang="ts">
	import {
		SvelteFlow,
		Controls,
		Background,
		BackgroundVariant,
		Position,
		MiniMap,
		type ColorMode
	} from '@xyflow/svelte';

	import '@xyflow/svelte/dist/style.css';

	type PageTheme = 'system' | ColorMode;
	type ForceColorMode = 'none' | ColorMode;

	let {
		pageTheme = 'system',
		forceColorMode = 'none'
	}: {
		pageTheme?: PageTheme;
		forceColorMode?: ForceColorMode;
	} = $props();

	const nodeDefaults = {
		sourcePosition: Position.Right,
		targetPosition: Position.Left
	};

	let nodes = $state.raw([
		{
			id: 'A',
			position: { x: 0, y: 150 },
			data: { label: 'A' },
			...nodeDefaults
		},
		{ id: 'B', position: { x: 250, y: 0 }, data: { label: 'B' }, ...nodeDefaults },
		{ id: 'C', position: { x: 250, y: 150 }, data: { label: 'C' }, ...nodeDefaults },
		{ id: 'D', position: { x: 250, y: 300 }, data: { label: 'D' }, ...nodeDefaults }
	]);

	let edges = $state.raw([
		{ id: 'A-B', source: 'A', target: 'B' },
		{ id: 'A-C', source: 'A', target: 'C' },
		{ id: 'A-D', source: 'A', target: 'D' }
	]);

	$effect(() => {
		if (pageTheme === 'system') {
			document.documentElement.removeAttribute('data-theme');
		} else {
			document.documentElement.setAttribute('data-theme', pageTheme);
		}
	});

	const resolvedForceColorMode = $derived(forceColorMode === 'none' ? undefined : forceColorMode);
</script>

<SvelteFlow bind:nodes bind:edges forceColorMode={resolvedForceColorMode} fitView>
	<Controls />
	<Background variant={BackgroundVariant.Dots} />
	<MiniMap />
</SvelteFlow>
