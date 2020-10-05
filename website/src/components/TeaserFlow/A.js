import React from 'react';

import TeaserFlow from 'components/TeaserFlow';

const elements = [
  {
    id: '1',
    type: 'input',
    position: {
      x: 200,
      y: 5,
    },
    data: {
      label: 'Input',
    },
  },
  {
    id: '2',
    position: {
      x: 0,
      y: 150,
    },
    data: {
      label: 'Default',
    },
  },
  {
    id: '3',
    position: {
      x: 400,
      y: 150,
    },
    data: {
      label: 'Default',
    },
  },
  {
    id: '4',
    type: 'output',
    position: {
      x: 200,
      y: 300,
    },
    data: {
      label: 'Output',
    },
  },
  {
    id: 'e1',
    source: '1',
    target: '2',
    label: 'default edge',
  },
  {
    id: 'e2',
    source: '1',
    target: '3',
    animated: true,
    label: 'animated edge',
  },
  {
    id: 'e3',
    source: '2',
    target: '4',
    type: 'smoothstep',
  },
  {
    id: 'e4',
    source: '3',
    target: '4',
    type: 'smoothstep',
  },
];

const flowProps = {
  elements,
  onLoad: (rf) => rf.fitView({ padding: 0.2 }),
};

export default () => (
  <TeaserFlow
    title="Feature-rich"
    description="You only need a few lines to get started. You get seamless zooming & panning, different edge and node types, single and multi-selection, controls and more."
    flowProps={flowProps}
    withControls
    fitView
  />
);
