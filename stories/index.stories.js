import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Graph from '../src';

const initialElements = [
  { id: '1', type: 'input', data: { label: '1 Tests' }, position: { x: 250, y: 5 } },
  { id: '2', data: { label: '2 This is a node This is a node This is a node This is a node' }, position: { x: 100, y: 100 } },
  { id: '3', data: { label: '3 I bring my own style' }, position: { x: 100, y: 200 }, style: { background: '#eee', color: '#222', border: '1px solid #bbb' } },
  { id: '4', type: 'output', data: { label: '4 nody nodes' }, position: { x: 50, y: 300 } },
  { id: '5', type: 'default', data: { label: '5 Another node'}, position: { x: 400, y: 300 } },
  { id: '6', type: 'output', data: { label: '7 output' }, position: { x: 250, y: 500 } },
  { source: '1', target: '2', animated: true },
  { source: '2', target: '3' },
  { source: '3', target: '4' },
  { source: '3', target: '5' },
  { source: '5', target: '6', type: 'straight', animated: true, style: { stroke: '#FFCC00' } },
];

storiesOf('Flow Renderer', module)
  .add('standard', () => (
    <Graph
      elements={initialElements}
      onElementClick={elm => action('element click')(elm)}
      onElementsRemove={elms => action('element remove')(elms)}
      onConnect={params => action('connect')(params)}
      onNodeDragStop={node => action('drag stop')(node)}
      style={{ width: 600, height: 400, border: '1px solid #eee' }}
      onLoad={flow => action('flow loaded')(flow)}
    />)
  )
  .add('with some emoji', () => (
    <div onClick={action('clicked')}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </div>
  ));
