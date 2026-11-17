<script lang="ts">
	import { tick } from 'svelte';
	import {
		SvelteFlow,
		useSvelteFlow,
		useSvelteFlowStore,
		useNode,
		useEdge,
		type Node,
		type Edge,
		type OnNodesChange,
		type OnEdgesChange
	} from '@xyflow/svelte';
	import '@xyflow/svelte/style.css';

	type Data = { count: number; old?: boolean };
	type CounterNode = Node<Data>;
	type CounterEdge = Edge<Data>;
	const initialNode = (): CounterNode => ({
		id: 'n',
		position: { x: 0, y: 0 },
		data: { count: 0, old: true },
		width: 100,
		height: 60
	});
	const initialEdge = (): CounterEdge => ({
		id: 'e',
		source: 'n',
		target: 'n',
		data: { count: 0, old: true }
	});
	let nodes = $state.raw<CounterNode[]>([initialNode()]);
	let edges = $state.raw<CounterEdge[]>([initialEdge()]);
	let result = $state('');
	const api = useSvelteFlow<CounterNode, CounterEdge>();
	const store = $derived(useSvelteFlowStore<CounterNode, CounterEdge>());
	const liveNode = useNode<CounterNode>('n');
	const liveEdge = useEdge<CounterEdge>('e');
	let mode = '';
	let recording = false;
	let batches = { nodes: 0, edges: 0 };

	const onnodeschange: OnNodesChange<CounterNode> = (changes) => {
		if (!recording || changes.toArray().every((change) => change.type === 'dimensions')) return;
		batches.nodes++;
		if (mode === 'clear') changes.clear();
		if (mode === 'edit') changes.add({ id: 'n', type: 'data', data: { count: 10 }, replace: true });
		if (mode === 'filter') changes.remove(changes.getByType('data')[0]);
	};
	const onedgeschange: OnEdgesChange<CounterEdge> = (changes) => {
		if (!recording) return;
		batches.edges++;
		if (mode === 'clear') changes.clear();
		if (mode === 'edit') changes.add({ id: 'e', type: 'data', data: { count: 10 }, replace: true });
		if (mode === 'filter') changes.remove(changes.getByType('data')[0]);
	};

	async function run(action: string) {
		recording = false;
		mode = action;
		result = '';
		nodes = action === 'add' ? [] : [initialNode()];
		edges = action === 'add' ? [] : [initialEdge()];
		await tick();
		batches = { nodes: 0, edges: 0 };
		recording = true;
		const seen: number[] = [];
		const data = (item: CounterNode | CounterEdge) => {
			seen.push(item.data!.count);
			return { count: item.data!.count + 1 };
		};
		const position = (node: CounterNode) => {
			seen.push(node.position.x);
			return { position: { x: node.position.x + 1, y: node.position.y } };
		};
		const edge = (item: CounterEdge) => ({ data: { ...item.data, ...data(item) } });
		const incrementData = () => {
			api.updateNodeData('n', data);
			api.updateNodeData('n', data);
			api.updateEdgeData('e', data);
			api.updateEdgeData('e', data);
		};

		if (action === 'add') {
			api.addNodes(initialNode());
			api.addEdges(initialEdge());
		}
		if (action === 'remove') {
			store.queueNodeChanges([{ id: 'n', type: 'remove' }]);
			store.queueEdgeChanges([{ id: 'e', type: 'remove' }]);
		}
		if (['twice', 'add', 'remove'].includes(action)) {
			incrementData();
			api.updateNode('n', position);
			api.updateNode('n', position);
			api.updateEdge('e', edge);
			api.updateEdge('e', edge);
		}
		if (action === 'mixed') {
			api.updateNodeData('n', { count: 4 });
			api.updateNodeData('n', data);
			api.updateNode('n', (node) => ({ data: data(node) }));
			api.updateEdgeData('e', { count: 4 });
			api.updateEdgeData('e', data);
			api.updateEdge('e', (item) => ({ data: data(item) }));
		}
		if (action === 'replace-data') {
			api.updateNodeData('n', { count: 4 }, { replace: true });
			api.updateEdgeData('e', { count: 4 }, { replace: true });
			api.updateNodeData('n', data);
			api.updateEdgeData('e', data);
		}
		if (action === 'replace-element') {
			api.updateNode(
				'n',
				{ ...initialNode(), position: { x: 10, y: 0 }, data: { count: 4 } },
				{ replace: true }
			);
			api.updateEdge('e', { ...initialEdge(), data: { count: 4 } }, { replace: true });
			api.updateNodeData('n', data);
			api.updateEdgeData('e', data);
			api.updateNode('n', position);
		}
		if (action === 'revert') {
			api.updateNode('n', { position: { x: 1, y: 0 } });
			api.updateNode('n', (node) => {
				seen.push(node.position.x);
				return { position: { x: 0, y: 0 } };
			});
		}
		if (['clear', 'edit', 'filter'].includes(action)) incrementData();
		if (['single', 'tick', 'missing'].includes(action)) {
			const id = action === 'missing' ? 'missing' : 'n';
			api.updateNodeData(id, data);
			api.updateEdgeData(action === 'missing' ? 'missing' : 'e', data);
		}
		if (action === 'tick' || action === 'edit') {
			await tick();
			mode = '';
			api.updateNodeData('n', data);
			api.updateEdgeData('e', data);
		}
		await tick();
		recording = false;
		const node = api.getNode('n');
		const currentEdge = api.getEdge('e');
		result = JSON.stringify({
			nodeCount: node?.data.count ?? null,
			edgeCount: currentEdge?.data?.count ?? null,
			x: node?.position.x ?? null,
			nodeKeys: Object.keys(node?.data ?? {}).sort(),
			edgeKeys: Object.keys(currentEdge?.data ?? {}).sort(),
			seen,
			batches,
			bound: [nodes[0]?.data.count ?? null, edges[0]?.data?.count ?? null]
		});
	}
</script>

<div>
	{#each ['twice', 'mixed', 'replace-data', 'replace-element', 'add', 'remove', 'revert', 'clear', 'edit', 'filter', 'single', 'tick', 'missing'] as action (action)}
		<button onclick={() => run(action)}>{action}</button>
	{/each}
	<output data-testid="update-result">{result}</output>
	<output data-testid="live-values"
		>{liveNode.current?.data.count ?? 'none'},{liveEdge.current?.data?.count ?? 'none'}</output
	>
</div>
<div style="height: 500px; width: 800px">
	<SvelteFlow bind:nodes bind:edges {onnodeschange} {onedgeschange} />
</div>
