<script lang="ts">
  import { Panel, useNodes, useEdges, useSvelteFlow, type Node, type Edge } from '@xyflow/svelte';
  import { action } from 'storybook/actions';
  import { createInteractionPanel, panelActions } from './actions';
  import './styles.css';

  const nodes = useNodes();
  const edges = useEdges();
  const flow = useSvelteFlow();
  const actions = createInteractionPanel(
    {
      ...flow,
      addNodes: (value) => {
        nodes.current = [...nodes.current, ...(value as Node[])];
      },
      setNodes: (value) => {
        nodes.current = value as Node[];
      },
      setEdges: (value) => {
        edges.current = value as Edge[];
      },
    },
    'svelte',
    (name, value) => action(name)(value)
  );
</script>

<Panel position="top-right" class="interaction-panel">
  {#each panelActions as item (item.id)}
    <button
      type="button"
      data-action={item.id}
      onclick={() => {
        action(item.id)();
        void actions[item.id]();
      }}
    >
      {item.label}
    </button>
  {/each}
</Panel>
