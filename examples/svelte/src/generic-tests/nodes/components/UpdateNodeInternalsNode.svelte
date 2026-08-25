<script lang="ts">
	import { useUpdateNodeInternals, useSvelteFlow, type NodeProps } from '@xyflow/svelte';

	let { id }: NodeProps = $props();

	const updateNodeInternals = useUpdateNodeInternals();
	const { getInternalNode } = useSvelteFlow();
	let containerEl: HTMLDivElement;

	$effect(() => {
		const w = window as any;
		w.__updateNodeInternals = updateNodeInternals;
		w.__getInternalNode = getInternalNode;
		w.__nodeId = id;
		w.__expandContainer = () => {
			if (containerEl && !containerEl.querySelector('.extra-content')) {
				const extra = document.createElement('div');
				extra.className = 'extra-content';
				extra.style.height = '150px';
				extra.style.background = '#a8dadc';
				containerEl.appendChild(extra);
			}
		};
	});
</script>

<div class="update-internals-node">
	<div bind:this={containerEl} class="toggle-container"></div>
</div>

<style>
	.update-internals-node {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 10px;
		border: 1px solid #ccc;
		background: #fff;
	}
</style>
