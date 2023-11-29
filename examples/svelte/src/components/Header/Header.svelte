<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	const routes = [
		'add-node-on-drop',
		'colormode',
		'custom-connection-line',
		'customnode',
		'dagre',
		'drag-n-drop',
		'edges',
		'figma',
		'interaction',
		'intersections',
		'node-toolbar',
		'overview',
		'stress',
		'subflows',
		'two-way-viewport',
		'usesvelteflow',
		'useupdatenodeinternals',
		'validation'
	];

	const onChange = (event: Event) => {
		const route = (event.target as HTMLSelectElement).value;
		goto(route);
	};
</script>

<header>
	<div class="logo">Svelte Flow</div>
	<select on:change={onChange} value={$page.route.id}>
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
