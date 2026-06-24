<script lang="ts">
	import {
		SvelteFlow,
		Controls,
		Background,
		BackgroundVariant,
		Position,
		MiniMap,
		Panel,
		type ColorMode
	} from '@xyflow/svelte';

	import '@xyflow/svelte/dist/style.css';

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

	type PageTheme = 'system' | ColorMode;

	let pageTheme = $state<PageTheme>('system');
	let forceColorMode = $state<ColorMode | undefined>(undefined);

	function updatePageTheme(value: PageTheme) {
		pageTheme = value;

		if (value === 'system') {
			document.documentElement.removeAttribute('data-theme');
		} else {
			document.documentElement.setAttribute('data-theme', value);
		}
	}
</script>

<SvelteFlow bind:nodes bind:edges {forceColorMode} fitView>
	<Controls />
	<Background variant={BackgroundVariant.Dots} />
	<MiniMap />

	<Panel>
		<select
			value={pageTheme}
			onchange={(event) => updatePageTheme(event.currentTarget.value as PageTheme)}
			data-testid="colormode-select"
		>
			<option value="system">system</option>
			<option value="light">light</option>
			<option value="dark">dark</option>
		</select>
	</Panel>
</SvelteFlow>
