<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	const routes = [
		'a11y',
		'add-node-on-drop',
		'color-mode',
		'custom-connection-line',
		'custom-minimap',
		'customnode',
		'dagre',
		'detached-handle',
		'drag-n-drop',
		'edges',
		'edge-toolbar',
		'figma',
		'handle-connect',
		'interaction',
		'intersections',
		'node-toolbar',
		'node-resizer',
		'overview',
		'stress',
		'subflows',
		'two-way-viewport',
		'usenodesdata',
		'usesvelteflow',
		'useupdatenodeinternals',
		'validation',
		'reset'
	];

	const onChange = (event: Event) => {
		const route = (event.target as HTMLSelectElement).value;
		goto(route);
	};
</script>

<header>
	<div class="logo">Svelte Flow</div>
	<select onchange={onChange} value={page.route.id}>
		{#each routes as route}
			<option value={`/examples/${route}`}>{route}</option>
		{/each}
	</select>
</header>

<style>
	header {
		padding: 10px;
		border-bottom: 1px solid #eee;
		display: flex;
		font-weight: 700;
		align-items: center;
		color: #111;
	}

	.logo {
		margin-right: 1rem;
	}
</style>
