import Component from '@glimmer/component';
import { pageTitle } from 'ember-page-title';
import {
  Background,
  BackgroundVariant,
  ControlButton,
  Controls,
  EmberFlow,
  Panel,
  Position,
} from '@xyflow/ember';

import type { Edge, Node } from '@xyflow/ember';

export default class ViewportControlsSample extends Component {
  nodes: Node[] = [
    {
      id: 'pan',
      data: { label: 'Pan + zoom' },
      position: { x: -260, y: -60 },
      type: 'input',
      sourcePosition: Position.Right,
      className: 'parity-node parity-node--blue',
    },
    {
      id: 'fit',
      data: { label: 'Fit view' },
      position: { x: 30, y: 100 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      className: 'parity-node parity-node--green',
    },
    {
      id: 'lock',
      data: { label: 'Lock interactivity' },
      position: { x: 340, y: -20 },
      targetPosition: Position.Left,
      className: 'parity-node parity-node--amber',
    },
  ];

  edges: Edge[] = [
    {
      id: 'pan-fit',
      source: 'pan',
      target: 'fit',
      animated: true,
    },
    {
      id: 'fit-lock',
      source: 'fit',
      target: 'lock',
    },
  ];

  <template>
    {{pageTitle "EmberFlow Viewport + Controls Sample"}}
    <main class='parity-sample'>
      <EmberFlow
        @nodes={{this.nodes}}
        @edges={{this.edges}}
        @fitView={{true}}
        @minZoom={{0.25}}
        @maxZoom={{4}}
      >
        <Background
          @id='major'
          @variant={{BackgroundVariant.Cross}}
          @gap={{80}}
          @size={{12}}
          @lineWidth={{1}}
          @color='#d7dee8'
          @bgColor='#f8fafc'
        />
        <Background
          @id='minor'
          @variant={{BackgroundVariant.Dots}}
          @gap={{20}}
          @size={{2}}
          @color='#9aa7b7'
        />
        <Controls>
          <ControlButton
            @className='parity-control-button'
            @title='custom control'
            @ariaLabel='custom control'
          >
            C
          </ControlButton>
        </Controls>
        <Panel @position='top-left'>
          <div class='parity-note'>
            <strong>Viewport + Controls</strong>
            <ol>
              <li>Drag empty canvas to pan.</li>
              <li>Watch the dot and cross background shift with the viewport.</li>
              <li>Scroll over the canvas to zoom.</li>
              <li>Use +, -, and fit in the lower-left controls.</li>
              <li>Click the lock button, then try dragging a node; unlock to restore editing.</li>
            </ol>
            <p class='parity-note__enhancement'>
              Enhancement note: zoomed HTML text can remain browser-composited and soft until a repaint.
              EmberFlow should refresh that after zoom without requiring a click.
            </p>
          </div>
        </Panel>
        <Panel @position='top-right'>
          <nav class='parity-sample-nav' aria-label='Parity samples'>
            <a href='/examples/parity'>All samples</a>
            <a href='/examples/parity/editing'>Editing</a>
            <a href='/examples/parity/edges'>Edges</a>
            <a href='/examples/parity/minimap'>MiniMap</a>
            <a href='/examples/parity/custom-handles'>Handles</a>
            <a href='/examples/parity/resizing'>Resize</a>
          </nav>
        </Panel>
      </EmberFlow>
    </main>
  </template>
}
