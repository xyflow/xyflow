import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import controlPanel from '../modifiers/control-panel.js';
import listen from '../modifiers/listen.js';
import type EmberFlowStore from '../store/index.js';
import { getFlowStore } from '../store/context.js';
import type { ControlsArgs } from '../types.js';

interface Signature {
  Args: ControlsArgs;
  Element: HTMLDivElement;
}

export default class Controls extends Component<Signature> {
  @tracked private store: EmberFlowStore | undefined;

  registerControlPanel(element: HTMLElement) {
    this.store = getFlowStore(element);
  }

  unregisterControlPanel() {
    this.store = undefined;
  }

  get positionClasses() {
    let position = this.args.position ?? 'bottom-left';
    return position.replace('-', ' ');
  }

  get orientationClass() {
    return this.args.orientation === 'horizontal' ? 'horizontal' : 'vertical';
  }

  get showZoom() {
    return this.args.showZoom ?? true;
  }

  get showFitView() {
    return this.args.showFitView ?? true;
  }

  get showInteractive() {
    return this.args.showInteractive ?? this.args.showLock ?? true;
  }

  get minZoomReached() {
    let store = this.store;
    return store ? store.viewport.zoom <= store.minZoom : false;
  }

  get maxZoomReached() {
    let store = this.store;
    return store ? store.viewport.zoom >= store.maxZoom : false;
  }

  get isInteractive() {
    return this.store?.isInteractive ?? true;
  }

  handleZoomIn = () => {
    void this.store?.zoomIn();
    this.args.onZoomIn?.();
  };

  handleZoomOut = () => {
    void this.store?.zoomOut();
    this.args.onZoomOut?.();
  };

  handleFitView = () => {
    void this.store?.fitView(this.args.fitViewOptions);
    this.args.onFitView?.();
  };

  handleToggleInteractivity = () => {
    let interactive = this.store?.toggleInteractivity() ?? true;
    this.args.onInteractiveChange?.(interactive);
  };

  <template>
    <div
      class='ember-flow__controls ember-flow__panel {{this.positionClasses}} {{this.orientationClass}}'
      data-testid='ember-flow__controls'
      aria-label='Ember Flow controls'
      {{controlPanel this}}
      ...attributes
    >
      {{#if this.showZoom}}
        <button
          class='ember-flow__controls-button ember-flow__controls-zoomin'
          type='button'
          title='zoom in'
          aria-label='zoom in'
          disabled={{this.maxZoomReached}}
          {{listen 'click' this.handleZoomIn}}
        >
          <svg width='12' height='12' viewBox='0 0 12 12' aria-hidden='true'>
            <path d='M6 1v10M1 6h10' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' />
          </svg>
        </button>
        <button
          class='ember-flow__controls-button ember-flow__controls-zoomout'
          type='button'
          title='zoom out'
          aria-label='zoom out'
          disabled={{this.minZoomReached}}
          {{listen 'click' this.handleZoomOut}}
        >
          <svg width='12' height='12' viewBox='0 0 12 12' aria-hidden='true'>
            <path d='M1 6h10' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' />
          </svg>
        </button>
      {{/if}}
      {{#if this.showFitView}}
        <button
          class='ember-flow__controls-button ember-flow__controls-fitview'
          type='button'
          title='fit view'
          aria-label='fit view'
          {{listen 'click' this.handleFitView}}
        >
          <svg width='12' height='12' viewBox='0 0 12 12' aria-hidden='true'>
            <path
              d='M2 4V2h2M8 2h2v2M10 8v2H8M4 10H2V8'
              fill='none'
              stroke='currentColor'
              stroke-width='1.3'
              stroke-linecap='round'
              stroke-linejoin='round'
            />
          </svg>
        </button>
      {{/if}}
      {{#if this.showInteractive}}
        <button
          class='ember-flow__controls-button ember-flow__controls-interactive'
          type='button'
          title='toggle interactivity'
          aria-label='toggle interactivity'
          {{listen 'click' this.handleToggleInteractivity}}
        >
          {{#if this.isInteractive}}
            <svg width='12' height='12' viewBox='0 0 12 12' aria-hidden='true'>
              <path
                d='M3 5V3.8a3 3 0 0 1 5.7-1.3M2.5 5h7v5h-7z'
                fill='none'
                stroke='currentColor'
                stroke-width='1.2'
                stroke-linecap='round'
                stroke-linejoin='round'
              />
            </svg>
          {{else}}
            <svg width='12' height='12' viewBox='0 0 12 12' aria-hidden='true'>
              <path
                d='M3 5V3.8a3 3 0 0 1 6 0V5M2.5 5h7v5h-7z'
                fill='none'
                stroke='currentColor'
                stroke-width='1.2'
                stroke-linecap='round'
                stroke-linejoin='round'
              />
            </svg>
          {{/if}}
        </button>
      {{/if}}
    </div>
  </template>
}
