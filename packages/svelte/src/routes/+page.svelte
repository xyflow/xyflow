<script lang="ts">
  import type { Node, Edge, NodeTypes } from '../lib/types';
  import SvelteFlow, { Controls, Background, BackgroundVariant, Minimap, Panel } from '../lib/index';
  import CustomNode from '../customnodes/Custom.svelte';

  const nodeTypes: NodeTypes = {
    custom: CustomNode,
  };

  // const yNodes = 10;
  // const xNodes = 10;

  // const nodes: Node[] = [];
  // const edges: Edge[] = [];



  // let source = null;

  // for (let y = 0; y < yNodes; y++) {
  //   for (let x = 0; x < xNodes; x++) {
  //     const position = { x: x * 100, y: y * 50 };
  //     const id = `${x}-${y}`;
  //     const data = { label: `Node ${id}` };
  //     const node = {
  //       id,
  //       data,
  //       position,
  //       type: x === 0 ? 'custom' : 'default',
  //     };
  //     nodes.push(node);

  //     if (source) {
  //       const edge = {
  //         id: `${source.id}-${id}`,
  //         source: source.id,
  //         target: id,
  //       };
  //       edges.push(edge);
  //     }

  //     source = node;
  //   }
  // }

  let nodes: Node<{ label: string }>[] = [{
    id: '1',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 150, y: 5 }
   }, {
    id: '2',
    type: 'default',
    data: { label: 'Node' },
    position: { x: 0, y: 150 },
  }, {
    id: 'A',
    type: 'default',
    data: { label: 'Styled with class' },
    class: 'custom-style',
    position: { x: 150, y: 150 },
  }, {
    id: '3',
    type: 'output',
    data: { label: 'Output Node' },
    position: { x: 300, y: 150 },
  }, 
  {
    id: 'B',
    type: 'default',
    data: { label: 'Styled with style' },
    style: 'border: 2px solid #ff5050;',
    position: { x: 450, y: 150 },
  },
  {
    id: '4',
    type: 'custom',
    data: { label: 'Custom Node' },
    position: { x: 150, y: 300 },
  }];

  let edges: Edge[] = [{
    id: '1-2',
    type: 'default',
    source: '1',
    target: '2'
  }, {
    id: '1-3',
    type: 'smoothstep',
    source: '1',
    target: '3'
  }, {
    id: '2-4',
    type: 'default',
    source: '2',
    target: '4'
  }];
  
  function updateNode() {
    nodes[0].position = { x: nodes[0].position.x + 20, y: nodes[0].position.y };
  }

  // $: {
  //   console.log('nodes changed', nodes)
  // }
</script>

<SvelteFlow bind:nodes bind:edges {nodeTypes} fitView>
  <Controls />
  <Background variant={BackgroundVariant.Dots} />
  <Minimap />
  <Panel position="top-right">
    <button on:click={updateNode}>update node pos</button>
  </Panel>
</SvelteFlow>

<style>
  :root {
    --node-width: 50;
  }

  :global(.react-flow .custom-style) {
    background: #ff5050;
    color: white;
  }
</style>
