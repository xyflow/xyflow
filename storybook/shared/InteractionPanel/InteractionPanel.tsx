import { Panel, useReactFlow, type Node, type Edge } from '@xyflow/react';
import { action } from 'storybook/actions';
import { createInteractionPanel, panelActions } from './actions';
import './styles.css';

export default function InteractionPanel() {
  const flow = useReactFlow();
  const actions = createInteractionPanel(
    {
      ...flow,
      setNodes: (nodes) => flow.setNodes(nodes as Node[]),
      setEdges: (edges) => flow.setEdges(edges as Edge[]),
    },
    'react',
    (name, value) => action(name)(value)
  );

  return (
    <Panel position="top-right" className="interaction-panel">
      {panelActions.map(({ id, label }) => (
        <button
          type="button"
          key={id}
          data-action={id}
          onClick={() => {
            action(id)();
            void actions[id]();
          }}
        >
          {label}
        </button>
      ))}
    </Panel>
  );
}
