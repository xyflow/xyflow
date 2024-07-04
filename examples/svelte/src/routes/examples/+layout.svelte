<script lang="ts">
	import { Header } from '$components/Header';
</script>

<div class="app">
	<Header />
	<div class="flow">
		<slot />
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
