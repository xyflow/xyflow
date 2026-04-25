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
  UseEmberFlow,
} from '@xyflow/ember';

import type { Edge, EmberFlowStore, Node, Viewport } from '@xyflow/ember';

export default class CustomControlsSample extends Component {
  initialViewport: Viewport = { x: 360, y: 240, zoom: 0.8 };

  nodes: Node[] = [
    {
      id: 'source',
      data: { label: 'Default toolbar' },
      position: { x: -220, y: -80 },
      type: 'input',
      sourcePosition: Position.Right,
      className: 'parity-node parity-node--blue',
    },
    {
      id: 'custom',
      data: { label: 'Injected controls' },
      position: { x: 110, y: 40 },
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
      className: 'parity-node parity-node--green',
    },
    {
      id: 'external',
      data: { label: 'App-owned UI' },
      position: { x: 460, y: -90 },
      targetPosition: Position.Left,
      className: 'parity-node parity-node--amber',
    },
  ];

  edges: Edge[] = [
    {
      id: 'source-custom',
      source: 'source',
      target: 'custom',
      animated: true,
    },
    {
      id: 'custom-external',
      source: 'custom',
      target: 'external',
    },
  ];

  zoomToTwo = (store: EmberFlowStore) => {
    void store.zoomTo(2, { duration: 120 });
  };

  fitBounds = (store: EmberFlowStore) => {
    void store.fitBounds({ x: -270, y: -130, width: 860, height: 320 }, { padding: 0.18, duration: 120 });
  };

  centerOrigin = (store: EmberFlowStore) => {
    void store.setCenter(0, 0, { zoom: 1, duration: 120 });
  };

  setWideViewport = (store: EmberFlowStore) => {
    void store.setViewport({ x: 160, y: 150, zoom: 0.72 }, { duration: 120, interpolate: 'linear' });
  };

  <template>
    {{pageTitle "EmberFlow Custom Controls Sample"}}
    <main class='parity-sample'>
      <EmberFlow
        @nodes={{this.nodes}}
        @edges={{this.edges}}
        @initialViewport={{this.initialViewport}}
        @minZoom={{0.25}}
        @maxZoom={{4}}
      >
        <Background @variant={{BackgroundVariant.Dots}} @gap={{20}} @size={{2}} @color='#9aa7b7' @bgColor='#f8fafc' />
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
        <Controls
          class='parity-custom-controls'
          @position='top-right'
          @orientation='horizontal'
          @showZoom={{false}}
          @showFitView={{false}}
          @showInteractive={{false}}
          as |controls|
        >
          <ControlButton
            @className='parity-control-button'
            @title='custom zoom to two'
            @ariaLabel='custom zoom to two'
            {{on 'click' (fn this.zoomToTwo controls)}}
          >
            <svg width='14' height='14' viewBox='0 0 14 14' aria-hidden='true'>
              <path
                d='M3 9.5 9.5 3M5.5 3h4v4'
                fill='none'
                stroke='currentColor'
                stroke-width='1.4'
                stroke-linecap='round'
                stroke-linejoin='round'
              />
              <path d='M3 3h2M3 3v2' fill='none' stroke='currentColor' stroke-width='1.4' stroke-linecap='round' />
            </svg>
          </ControlButton>
          <ControlButton
            @className='parity-control-button'
            @title='custom fit bounds'
            @ariaLabel='custom fit bounds'
            {{on 'click' (fn this.fitBounds controls)}}
          >
            <svg width='14' height='14' viewBox='0 0 14 14' aria-hidden='true'>
              <path
                d='M3.2 5V3.2H5M9 3.2h1.8V5M10.8 9v1.8H9M5 10.8H3.2V9'
                fill='none'
                stroke='currentColor'
                stroke-width='1.4'
                stroke-linecap='round'
                stroke-linejoin='round'
              />
              <path d='M5.4 7h3.2' stroke='currentColor' stroke-width='1.4' stroke-linecap='round' />
            </svg>
          </ControlButton>
        </Controls>
        <Panel @position='top-left'>
          <div class='parity-note'>
            <strong>Custom Controls</strong>
            <ol>
              <li>The lower-left toolbar keeps default zoom, fit, and lock controls.</li>
              <li>The target button in that toolbar is injected app UI using the yielded Controls store.</li>
              <li>The top-right toolbar is fully custom: default buttons are disabled and only app buttons render.</li>
              <li>Position custom toolbars with @position, like Panel: top-right, bottom-left, top-center, or center-right.</li>
              <li>Use @orientation for row or column layout, and pass a class for app-specific visual treatment.</li>
              <li>Both toolbars call the same surface API as external Ember application UI.</li>
              <li>The helper buttons below use the EmberFlow block store outside Controls.</li>
            </ol>
            <UseEmberFlow as |flow|>
              <div class='parity-note-actions' aria-label='Custom controls helper actions'>
                <button type='button' {{on 'click' (fn this.zoomToTwo flow)}}>zoomTo 2</button>
                <button type='button' {{on 'click' (fn this.setWideViewport flow)}}>setViewport</button>
                <button type='button' {{on 'click' (fn this.fitBounds flow)}}>fitBounds</button>
              </div>
            </UseEmberFlow>
          </div>
        </Panel>
        <Panel @position='bottom-right'>
          <nav class='parity-sample-nav' aria-label='Parity samples'>
            <a href='/examples/parity'>All samples</a>
            <a href='/examples/parity/viewport-controls'>Viewport</a>
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
