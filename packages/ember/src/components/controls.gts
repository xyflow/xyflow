import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import controlPanel from '../modifiers/control-panel.js';
import listen from '../modifiers/listen.js';
import type EmberFlowStore from '../store/index.js';
import { getFlowStore } from '../store/context.js';
import type { ControlsArgs } from '../types.js';

interface Signature {
  Args: ControlsArgs;
  Blocks: {
    default: [];
  };
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

  get isLocked() {
    return !this.isInteractive;
  }

  get interactiveButtonClass() {
    return [
      'ember-flow__controls-button',
      'ember-flow__controls-interactive',
      this.isLocked ? 'is-locked' : 'is-unlocked',
    ].join(' ');
  }

  get interactiveTitle() {
    return this.isLocked ? 'unlock interactivity' : 'lock interactivity';
  }

  get interactivePressed() {
    return this.isLocked ? 'true' : 'false';
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
          class={{this.interactiveButtonClass}}
          type='button'
          title={{this.interactiveTitle}}
          aria-label={{this.interactiveTitle}}
          aria-pressed={{this.interactivePressed}}
          {{listen 'click' this.handleToggleInteractivity}}
        >
          {{#if this.isInteractive}}
            <svg width='13' height='15' viewBox='0 0 25 32' aria-hidden='true'>
              <path
                d='M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z'
                fill='currentColor'
              />
            </svg>
          {{else}}
            <svg width='13' height='15' viewBox='0 0 25 32' aria-hidden='true'>
              <path
                d='M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z'
                fill='currentColor'
              />
            </svg>
          {{/if}}
        </button>
      {{/if}}
      {{yield}}
    </div>
  </template>
}
