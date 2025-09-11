<script lang="ts">
    import { SvelteFlow, Controls, Background, type Node, type Edge } from '@xyflow/svelte';
    import '@xyflow/svelte/dist/style.css';
  
    let nodes = $state.raw<Node[]>([
      {
      id: '1',
      position: { x: 100, y: 100 },
      data: { label: 'Hello' },
    },
    {
      id: '2',
      position: { x: 300, y: 100 },
      data: { label: 'World Svelte!' },
    },
    ]);
  
    let edges = $state.raw<Edge[]>([  
      {
        id: 'e1-2',
        source: '1',
        target: '2',
      },
    ]);
  </script>
  
  <div style="width: 100%; height: 400px;">
    <SvelteFlow bind:nodes bind:edges fitView>
      <Controls />
      <Background />
    </SvelteFlow>
  </div>