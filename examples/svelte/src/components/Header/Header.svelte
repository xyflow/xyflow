<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	const routes = [
		'custom-connection-line',
		'customnode',
		'drag-n-drop',
		'edges',
		'figma',
		'interaction',
		'overview',
		'stress',
		'subflows',
		'two-way-viewport',
		'usesvelteflow',
		'useupdatenodeinternals',
		'validation',
		'intersections',
		'add-node-on-drop'
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
			<option value={`/${route}`}>{route}</option>
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
