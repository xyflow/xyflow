<script module lang="ts">
  import type { Node } from '@xyflow/svelte';

  type TextNodeType = Node<{ text: string }, 'text'>;
  type UppercaseNodeType = Node<{ text: string }, 'uppercase'>;
  type ResultNodeType = Node<{}, 'result'>;

  export function isTextNode(node: any): node is TextNodeType | UppercaseNodeType {
    return !node || !node.type ? false : node.type === 'text' || node.type === 'uppercase';
  }

  export type MyNode = TextNodeType | UppercaseNodeType | ResultNodeType;
</script>

<script lang="ts">
  import {
    SvelteFlow,
    Controls,
    Background,
    BackgroundVariant,
    MiniMap,
    type NodeTypes,
    type Edge,
  } from '@xyflow/svelte';
  import '@xyflow/svelte/dist/style.css';

  import { initialNodes, initialEdges } from './config';
  import TextNode from './TextNode.svelte';
  import UppercaseNode from './UppercaseNode.svelte';
  import ResultNode from './ResultNode.svelte';

  const nodeTypes: NodeTypes = {
    text: TextNode,
    uppercase: UppercaseNode,
    result: ResultNode,
  };

  let nodes = $state.raw<MyNode[]>(structuredClone(initialNodes) as MyNode[]);
  let edges = $state.raw<Edge[]>(structuredClone(initialEdges) as Edge[]);
</script>

<div style="height: 100vh;">
  <SvelteFlow bind:nodes bind:edges {nodeTypes} fitView>
    <Controls />
    <Background variant={BackgroundVariant.Dots} />
    <MiniMap />
  </SvelteFlow>
</div>
