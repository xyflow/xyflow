<script lang="ts">
	import { Header } from '$components/Header';
	import { SvelteFlowProvider } from '@xyflow/svelte';
</script>

<div class="app">
	<Header />
	<div class="flow">
		<SvelteFlowProvider>
			<slot />
		</SvelteFlowProvider>
	</div>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.flow {
		flex: 1;
	}
</style>
