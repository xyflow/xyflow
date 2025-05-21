<script lang="ts">
	import {
		SvelteFlow,
		Controls,
		Background,
		MiniMap,
	} from '@xyflow/svelte';

	import '@xyflow/svelte/dist/style.css';


	let nodes = $state.raw([
		{
			id: 'A',
			position: { x: 0, y: 0 },
			data: { label: 'A' },
			
		},
		{ id: 'B', position: { x: -100, y: 150 }, data: { label: 'B' } },
		{ id: 'C', position: { x: 100, y: 150 }, data: { label: 'C' }  },
		{ id: 'D', position: { x: 0, y: 260 }, data: { label: 'D' }  }
	]);

	let edges = $state.raw([
		{ id: 'A-B', source: 'A', target: 'B' },
		{ id: 'A-C', source: 'A', target: 'C' },
		{ id: 'A-D', source: 'A', target: 'D' }
	]);

</script>

<SvelteFlow bind:nodes bind:edges fitView   labelConfig={{
    'a11yDescription.node.default': 'Svelte Custom node description',
    'a11yDescription.node.keyboardDisabled': 'Svelte Custom keyboard-disabled node description',
    'a11yDescription.edge.default': 'Svelte Custom edge description',
  }}>
	<Controls />
	<Background />
	<MiniMap />
</SvelteFlow>
