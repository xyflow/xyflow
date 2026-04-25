import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type { Viewport } from '@xyflow/system';

import flowContext from '../modifiers/flow-context.js';
import { getFlowStore } from '../store/context.js';
import type EmberFlowStore from '../store/index.js';
import type { UseViewportArgs } from '../types.js';

interface Signature {
  Args: UseViewportArgs;
  Blocks: {
    default: [Viewport];
  };
}

export default class UseViewport extends Component<Signature> {
  @tracked private store: EmberFlowStore | undefined;
  @tracked private currentViewport: Viewport = { x: 0, y: 0, zoom: 1 };

  private unsubscribeViewport: (() => void) | undefined;

  get viewport() {
    return this.currentViewport;
  }

  get hasStore() {
    return Boolean(this.store);
  }

  registerFlowContext(element: HTMLElement) {
    let store = getFlowStore(element);

    if (!store || this.store === store) {
      return;
    }

    this.unsubscribeViewport?.();
    this.store = store;
    this.unsubscribeViewport = store.onViewportChange((viewport) => {
      this.currentViewport = viewport;
    });
  }

  unregisterFlowContext() {
    this.unsubscribeViewport?.();
    this.unsubscribeViewport = undefined;
    this.store = undefined;
  }

  <template>
    <span hidden aria-hidden='true' class='ember-flow__store-access' {{flowContext this}}></span>
    {{#if this.hasStore}}
      {{yield this.viewport}}
    {{/if}}
  </template>
}
