<script context="module" lang="ts">
	import TextNode from './TextNode.svelte';
	import UppercaseNode from './UppercaseNode.svelte';
	import ResultNode from './ResultNode.svelte';

	export function isTextNode(node: any): node is TextNode | UppercaseNode {
		return node.type === 'text' || node.type === 'uppercase';
	}

	export type MyNode = TextNode | UppercaseNode | ResultNode;
</script>

<script lang="ts">
	import { writable } from 'svelte/store';
	import {
		SvelteFlow,
		Controls,
		Background,
		BackgroundVariant,
		MiniMap,
		type Node,
		type NodeTypes,
		type Edge
	} from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';

	const nodeTypes: NodeTypes = {
		text: TextNode,
		uppercase: UppercaseNode,
		result: ResultNode
	};

	const nodes = writable<Node[]>([
		{
			id: '1',
			type: 'text',
			data: {
				text: 'hello'
			},
			position: { x: -100, y: -50 }
		},
		{
			id: '1a',
			type: 'uppercase',
			data: {
				text: ''
			},
			position: { x: 100, y: 0 }
		},
		{
			id: '2',
			type: 'text',
			data: {
				text: 'world'
			},
			position: { x: 0, y: 100 }
		},

		{
			id: '3',
			type: 'result',
			data: {},
			position: { x: 300, y: 50 }
		}
	]);

	const edges = writable<Edge[]>([
		{
			id: 'e1-1a',
			source: '1',
			target: '1a'
		},
		{
			id: 'e1a-3',
			source: '1a',
			target: '3'
		},
		{
			id: 'e2-3',
			source: '2',
			target: '3'
		}
	]);
</script>

<SvelteFlow {nodes} {edges} {nodeTypes} fitView>
	<Controls />
	<Background variant={BackgroundVariant.Dots} />
	<MiniMap />
</SvelteFlow>
