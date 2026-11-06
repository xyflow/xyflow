<script lang="ts">
	import { SvelteFlow, Background, Panel, type Node } from '@xyflow/svelte';

	import '@xyflow/svelte/style.css';

	let nodes = $state.raw<Node[]>([
		{ id: '1', data: { label: 'Node 1' }, position: { x: 0, y: 0 } },
		{ id: '2', data: { label: 'Node 2' }, position: { x: 200, y: 100 } },
		{ id: '3', data: { label: 'Node 3' }, position: { x: 0, y: 200 } }
	]);
	let edges = $state.raw([]);

	const panOnDragOptions: Record<string, boolean | number[]> = {
		true: true,
		false: false,
		'[1, 2]': [1, 2],
		'[0, 1, 2]': [0, 1, 2],
		'[2]': [2]
	};

	let dragThreshold = $state(1);
	let paneDragThreshold = $state(1);
	let selectionOnDrag = $state(true);
	let panOnDrag = $state('[1, 2]');
	let snapGridSize = $state(0);
	let messages = $state<string[]>([]);
	let clickCount = 0;

	const log = (msg: string) => {
		clickCount++;
		messages = [`#${clickCount} ${msg}`, ...messages].slice(0, 10);
	};

	const onnodeclick = ({ node }: { node: Node }) => log(`node click: node ${node.id}`);
	const onpaneclick = () => log('pane click');
	const onpanecontextmenu = ({ event }: { event: MouseEvent }) => {
		event.preventDefault();
		log('pane context menu');
	};
	const onmovestart = () => log('move start');
	const onmoveend = () => log('move end');
	const onselectionstart = () => log('selection start');
	const onselectionend = () => log('selection end');
</script>

<SvelteFlow
	bind:nodes
	bind:edges
	{onnodeclick}
	{onpaneclick}
	{onpanecontextmenu}
	{onmovestart}
	{onmoveend}
	{onselectionstart}
	{onselectionend}
	nodeDragThreshold={dragThreshold}
	{paneDragThreshold}
	snapGrid={snapGridSize > 0 ? [snapGridSize, snapGridSize] : undefined}
	{selectionOnDrag}
	panOnDrag={panOnDragOptions[panOnDrag]}
	fitView
>
	<Background gap={snapGridSize > 0 ? snapGridSize : undefined} />
	<Panel position="top-left" class="controls">
		<div>
			<label>
				nodeDragThreshold
				<input type="number" min="0" bind:value={dragThreshold} />
			</label>
		</div>
		<div>
			<label>
				paneDragThreshold
				<input type="number" min="0" bind:value={paneDragThreshold} />
			</label>
		</div>
		<div>
			<label>
				panOnDrag
				<select bind:value={panOnDrag}>
					{#each Object.keys(panOnDragOptions) as option (option)}
						<option value={option}>{option}</option>
					{/each}
				</select>
			</label>
		</div>
		<div>
			<label>
				selectionOnDrag
				<input type="checkbox" bind:checked={selectionOnDrag} />
			</label>
		</div>
		<div>
			<label>
				snapGrid size (0 = off)
				<input type="number" min="0" bind:value={snapGridSize} />
			</label>
		</div>
		<button onclick={() => (messages = [])}>clear</button>
		<ul>
			{#each messages as msg (msg)}
				<li>{msg}</li>
			{/each}
		</ul>
	</Panel>
</SvelteFlow>

<style>
	:global(.svelte-flow__panel.controls) {
		background: var(--xy-node-background-color-default);
		color: var(--xy-node-color-default);
		border: var(--xy-node-border-default);
		border-radius: 5px;
		padding: 10px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	:global(.svelte-flow__panel.controls button) {
		align-self: flex-start;
	}

	:global(.svelte-flow__panel.controls ul) {
		margin: 0;
		padding-left: 20px;
	}
</style>
