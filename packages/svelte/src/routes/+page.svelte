<script lang="ts">
  import type { Node, Edge } from '@reactflow/system';
  
  import SvelteFlow, { Controls, Background, BackgroundVariant, Minimap } from '../lib/index';
  import CustomNode from '../customnodes/Custom.svelte';

  const yNodes = 10;
  const xNodes = 10;

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const nodeTypes = {
    custom: CustomNode,
  };

  let source = null;

  for (let y = 0; y < yNodes; y++) {
    for (let x = 0; x < xNodes; x++) {
      const position = { x: x * 100, y: y * 50 };
      const id = `${x}-${y}`;
      const data = { label: `Node ${id}` };
      const node = {
        id,
        data,
        position,
        type: x === 0 ? 'custom' : 'default',
      };
      nodes.push(node);

      if (source) {
        const edge = {
          id: `${source.id}-${id}`,
          source: source.id,
          target: id,
        };
        edges.push(edge);
      }

      source = node;

      
    }
  }

  // const nodes = [{
  //   id: '1',
  //   type: 'input',
  //   data: { label: 'Input Node' },
  //   position: { x: 250, y: 5 }
  //  }, {
  //    id: '2',
  //    type: 'input',
  //    data: { label: 'Input Node 2' },
  //    position: { x: 150, y: 250 },
  //  }]

  //  const edges = [{
  //   id: '1-2',
  //   type: 'default',
  //   source: '1',
  //   target: '2'
  //  }]
</script>

<SvelteFlow {nodes} {edges} {nodeTypes} fitView>
  <Controls />
  <Background variant={BackgroundVariant.Dots} />
  <Minimap />
</SvelteFlow>

<style>
  :root {
    --node-width: 50;
  }
</style>
