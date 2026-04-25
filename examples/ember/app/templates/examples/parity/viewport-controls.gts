import Component from '@glimmer/component';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { pageTitle } from 'ember-page-title';
import {
  Background,
  BackgroundVariant,
  ControlButton,
  Controls,
  EmberFlow,
  Panel,
  Position,
  ViewportPortal,
} from '@xyflow/ember';

import type { Edge, Node, Viewport } from '@xyflow/ember';
import type { EmberFlowStore } from '@xyflow/ember';

export default class ViewportControlsSample extends Component {
  initialViewport: Viewport = { x: 520, y: 360, zoom: 0.65 };

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
      position: { x: 90, y: -20 },
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

  zoomToTwo = (store: EmberFlowStore) => {
    void store.zoomTo(2, { duration: 120 });
  };

  setWideViewport = (store: EmberFlowStore) => {
    void store.setViewport({ x: 180, y: 120, zoom: 0.75 }, { duration: 120, interpolate: 'linear' });
  };

  fitBounds = (store: EmberFlowStore) => {
    void store.fitBounds({ x: -310, y: -110, width: 750, height: 330 }, { padding: 0.18, duration: 120 });
  };

  centerOrigin = (store: EmberFlowStore) => {
    void store.setCenter(0, 0, { zoom: 1, duration: 120 });
  };

  <template>
    {{pageTitle "EmberFlow Viewport + Controls Sample"}}
    <main class='parity-sample'>
      <EmberFlow
        @nodes={{this.nodes}}
        @edges={{this.edges}}
        @initialViewport={{this.initialViewport}}
        @minZoom={{0.25}}
        @maxZoom={{4}}
        as |flow|
      >
        <Background
          @variant={{BackgroundVariant.Dots}}
          @gap={{20}}
          @size={{2}}
          @color='#9aa7b7'
          @bgColor='#f8fafc'
        />
        <ViewportPortal>
          <div
            class='parity-renderer-label nopan nodrag'
            data-testid='viewport-portal-probe'
            style='position: absolute; transform: translate(160px, -90px); pointer-events: all;'
          >
            ViewportPortal
          </div>
        </ViewportPortal>
        <Controls as |controls|>
          <ControlButton
            @className='parity-control-button'
            @title='center origin'
            @ariaLabel='center origin'
            {{on 'click' (fn this.centerOrigin controls)}}
          >
            <svg width='14' height='14' viewBox='0 0 14 14' aria-hidden='true'>
              <circle cx='7' cy='7' r='4.5' fill='none' stroke='currentColor' stroke-width='1.4' />
              <path d='M7 1v3M7 10v3M1 7h3M10 7h3' stroke='currentColor' stroke-width='1.4' stroke-linecap='round' />
            </svg>
          </ControlButton>
        </Controls>
        <Panel @position='top-left'>
          <div class='parity-note'>
            <strong>Viewport + Controls</strong>
            <ol>
              <li>Drag empty canvas to pan.</li>
              <li>Watch the dot background shift with the viewport.</li>
              <li>Scroll over the canvas to zoom.</li>
              <li>Use +, -, and fit in the lower-left controls.</li>
              <li>Use the target control to center the origin.</li>
              <li>The lock control should switch clearly between locked and unlocked interaction.</li>
              <li>Use the helper buttons below to exercise the yielded store viewport API.</li>
              <li>The ViewportPortal label should move and scale with nodes.</li>
            </ol>
            <div class='parity-note-actions' aria-label='Viewport helper actions'>
              <button type='button' {{on 'click' (fn this.zoomToTwo flow)}}>zoomTo 2</button>
              <button type='button' {{on 'click' (fn this.setWideViewport flow)}}>setViewport</button>
              <button type='button' {{on 'click' (fn this.fitBounds flow)}}>fitBounds</button>
            </div>
            <p class='parity-note__enhancement'>
              Enhancement note: zoomed HTML text can remain browser-composited and soft until a repaint.
              EmberFlow should refresh that after zoom without requiring a click.
            </p>
          </div>
        </Panel>
        <Panel @position='bottom-right'>
          <nav class='parity-sample-nav' aria-label='Parity samples'>
            <a href='/examples/parity'>All samples</a>
            <a href='/examples/parity/custom-controls'>Custom UI</a>
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
